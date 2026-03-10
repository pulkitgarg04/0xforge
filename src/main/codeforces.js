const { ipcMain, BrowserWindow } = require('electron');

function decodeHtmlEntities(text) {
    if (!text) return '';

    const namedEntities = {
        '&nbsp;': ' ',
        '&lt;': '<',
        '&gt;': '>',
        '&amp;': '&',
        '&quot;': '"',
        '&#39;': "'"
    };

    return text
        .replace(/&#(\d+);/g, (_match, dec) => String.fromCharCode(Number(dec)))
        .replace(/&#x([\da-f]+);/gi, (_match, hex) => String.fromCharCode(parseInt(hex, 16)))
        .replace(/&(nbsp|lt|gt|amp|quot|#39);/g, (entity) => namedEntities[entity] || entity);
}

function stripHtmlTags(html) {
    return html.replace(/<[^>]+>/g, '');
}

function normalizeSampleText(rawHtml) {
    if (!rawHtml) return '';

    const testLineMatches = [...rawHtml.matchAll(/<div[^>]*class="[^"]*test-example-line[^"]*"[^>]*>([\s\S]*?)<\/div>/gi)];
    if (testLineMatches.length > 0) {
        return testLineMatches
            .map((match) => decodeHtmlEntities(stripHtmlTags(match[1]).trim()))
            .join('\n')
            .replace(/\r/g, '')
            .trim();
    }

    return decodeHtmlEntities(
        rawHtml
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<\/div>/gi, '\n')
            .replace(/<\/p>/gi, '\n')
            .replace(/<[^>]+>/g, '')
    )
        .replace(/\r/g, '')
        .split('\n')
        .map((line) => line.replace(/[ \t]+$/g, ''))
        .join('\n')
        .trim();
}

function extractDivAt(html, startIndex) {
    const openingMatch = html.slice(startIndex).match(/^<div\b[^>]*>/i);
    if (!openingMatch) return null;

    const tagRegex = /<\/?div\b[^>]*>/gi;
    let depth = 0;
    tagRegex.lastIndex = startIndex;

    for (;;) {
        const match = tagRegex.exec(html);
        if (!match) return null;

        const token = match[0].toLowerCase();
        if (token.startsWith('</div')) {
            depth -= 1;
            if (depth === 0) {
                return {
                    html: html.slice(startIndex, tagRegex.lastIndex),
                    endIndex: tagRegex.lastIndex
                };
            }
        } else {
            depth += 1;
        }
    }
}

function extractDivByClass(html, className, fromIndex = 0) {
    const divRegex = /<div\b([^>]*)>/gi;
    divRegex.lastIndex = fromIndex;

    let match;
    while ((match = divRegex.exec(html)) !== null) {
        const attrs = match[1] || '';
        const classMatch = attrs.match(/\bclass\s*=\s*"([^"]*)"/i) || attrs.match(/\bclass\s*=\s*'([^']*)'/i);
        if (!classMatch) continue;

        const classTokens = classMatch[1].split(/\s+/).filter(Boolean);
        if (!classTokens.includes(className)) continue;

        const extracted = extractDivAt(html, match.index);
        if (extracted) return extracted.html;
    }

    return '';
}

function extractSampleTests(html) {
    const sampleContainer = extractDivByClass(html, 'sample-tests');
    const source = sampleContainer || html;
    const tests = [];

    const sampleStartRegex = /<div\b[^>]*class="[^"]*\bsample-test\b[^"]*"[^>]*>/gi;
    let sampleStartMatch;
    let index = 1;

    while ((sampleStartMatch = sampleStartRegex.exec(source)) !== null) {
        const sampleBlock = extractDivAt(source, sampleStartMatch.index);
        if (!sampleBlock) continue;

        const inputBlock = extractDivByClass(sampleBlock.html, 'input');
        const outputBlock = extractDivByClass(sampleBlock.html, 'output');
        const inputMatch = inputBlock.match(/<pre[^>]*>([\s\S]*?)<\/pre>/i);
        const outputMatch = outputBlock.match(/<pre[^>]*>([\s\S]*?)<\/pre>/i);

        if (inputMatch) {
            tests.push({
                id: index,
                input: normalizeSampleText(inputMatch[1]),
                expected: normalizeSampleText(outputMatch ? outputMatch[1] : ''),
                status: 'idle'
            });
            index += 1;
        }
    }

    if (tests.length > 0) {
        return tests;
    }

    const inputBlocks = source.match(/<div\b[^>]*class="[^"]*\binput\b[^"]*"[^>]*>[\s\S]*?<pre[^>]*>[\s\S]*?<\/pre>[\s\S]*?<\/div>/gi) || [];
    const outputBlocks = source.match(/<div\b[^>]*class="[^"]*\boutput\b[^"]*"[^>]*>[\s\S]*?<pre[^>]*>[\s\S]*?<\/pre>[\s\S]*?<\/div>/gi) || [];

    for (let i = 0; i < inputBlocks.length; i++) {
        const inputMatch = inputBlocks[i].match(/<pre[^>]*>([\s\S]*?)<\/pre>/i);
        const outputMatch = outputBlocks[i] ? outputBlocks[i].match(/<pre[^>]*>([\s\S]*?)<\/pre>/i) : null;

        if (inputMatch) {
            tests.push({
                id: tests.length + 1,
                input: normalizeSampleText(inputMatch[1]),
                expected: normalizeSampleText(outputMatch ? outputMatch[1] : ''),
                status: 'idle'
            });
        }
    }

    return tests;
}

function parseCodeforcesHTML(html) {
    const problem = {
        title: '',
        timeLimit: '',
        memoryLimit: '',
        statement: '',
        inputSpec: '',
        outputSpec: '',
        sampleTests: [],
        tags: [],
        difficulty: ''
    };

    const titleMatch = html.match(/<div class="title">([\s\S]*?)<\/div>/);
    if (titleMatch) {
        problem.title = titleMatch[1].trim();
    }

    const timeLimitMatch = html.match(/<div class="time-limit">([\s\S]*?)<\/div>/);
    if (timeLimitMatch) {
        problem.timeLimit = timeLimitMatch[1].replace(/<div.*?>|&nbsp;/g, '').replace('time limit per test', '').trim();
    }

    const memoryLimitMatch = html.match(/<div class="memory-limit">([\s\S]*?)<\/div>/);
    if (memoryLimitMatch) {
        problem.memoryLimit = memoryLimitMatch[1].replace(/<div.*?>|&nbsp;/g, '').replace('memory limit per test', '').trim();
    }

    const statementMatch = html.match(/<div class="problem-statement">([\s\S]*?)<div class="input-specification">/);
    if (statementMatch) {
        let content = statementMatch[1];
        content = content.replace(/<div class="header">[\s\S]*?<\/div>/, '');
        problem.statement = content.trim();
    }

    const inputSpecMatch = html.match(/<div class="input-specification">([\s\S]*?)<\/div>[\s\S]*?<div class="output-specification">/);
    if (inputSpecMatch) {
        problem.inputSpec = inputSpecMatch[1].replace(/<div class="section-title">.*?<\/div>/, '').trim();
    }

    const outputSpecMatch = html.match(/<div class="output-specification">([\s\S]*?)<\/div>[\s\S]*?<div class="sample-tests">/);
    if (outputSpecMatch) {
        problem.outputSpec = outputSpecMatch[1].replace(/<div class="section-title">.*?<\/div>/, '').trim();
    }

    problem.sampleTests = extractSampleTests(html);

    const tagMatches = html.match(/<span class="tag-box" title=".*?">([\s\S]*?)<\/span>/g) || [];
    problem.tags = tagMatches.map(tag => {
        const m = tag.match(/>([\s\S]*?)<\/span>/);
        return m ? m[1].trim() : '';
    }).filter(t => t);

    const difficultyMatch = html.match(/<span title="Difficulty" style="[\s\S]*?">([\s\S]*?)<\/span>/);
    if (difficultyMatch) problem.difficulty = difficultyMatch[1].trim();

    return problem;
}

function normalizeProblemId(id) {
    id = id.trim();
    if (id.includes('codeforces.com')) {
        const contestMatch = id.match(/\/contest\/(\d+)\/problem\/(\w+)/);
        if (contestMatch) return { contestId: contestMatch[1], problemLetter: contestMatch[2] };

        const problemsetMatch = id.match(/\/problemset\/problem\/(\d+)\/(\w+)/);
        if (problemsetMatch) return { contestId: problemsetMatch[1], problemLetter: problemsetMatch[2], isProblemset: true };

        const gymMatch = id.match(/\/gym\/(\d+)\/problem\/(\w+)/);
        if (gymMatch) return { contestId: gymMatch[1], problemLetter: gymMatch[2], isGym: true };
    }

    const match = id.match(/^(\d+)[/]?(\w+)$/);
    if (match) return { contestId: match[1], problemLetter: match[2] };

    return null;
}

function setupCodeforcesHandlers() {
    ipcMain.handle('codeforces:fetchProblem', async (_event, problemId) => {
        let tempWindow = null;

        try {
            let url = '';
            let idInfo = normalizeProblemId(problemId);

            if (problemId.trim().startsWith('http')) {
                url = problemId.trim();
            } else if (idInfo) {
                const base = idInfo.isGym ? 'gym' : 'contest';
                url = `https://codeforces.com/${base}/${idInfo.contestId}/problem/${idInfo.problemLetter}`;
            }

            if (!url) throw new Error('Invalid Problem ID or URL');

            tempWindow = new BrowserWindow({
                show: false,
                webPreferences: {
                    nodeIntegration: false,
                    contextIsolation: true
                }
            });

            await tempWindow.loadURL(url, {
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            });

            const html = await tempWindow.webContents.executeJavaScript('document.documentElement.outerHTML');

            if (html.includes('Just a moment...')) {
                throw new Error('Still stuck on Cloudflare verification. Please try again.');
            }

            const problemData = parseCodeforcesHTML(html);
            problemData.url = url;

            const match = normalizeProblemId(url);
            problemData.contestId = match ? match.contestId : (idInfo ? idInfo.contestId : '');
            problemData.problemLetter = match ? match.problemLetter : (idInfo ? idInfo.problemLetter : '');

            if (!problemData.title) {
                throw new Error('Failed to parse problem data. The page layout might have changed or access was blocked.');
            }

            return { success: true, data: problemData };
        } catch (error) {
            console.error('Codeforces fetch error:', error);
            return { success: false, error: error.message };
        } finally {
            if (tempWindow) tempWindow.destroy();
        }
    });
}

module.exports = {
    setupCodeforcesHandlers,
    parseCodeforcesHTML,
    extractSampleTests,
    normalizeSampleText
};
