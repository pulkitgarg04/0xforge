export const sampleCode = `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n;
    cin >> n;

    vector<int> a(n);
    for (int i = 0; i < n; i++) {
        cin >> a[i];
    }

    sort(a.begin(), a.end());

    long long ans = 0;
    for (int i = 0; i < n; i++) {
        ans += a[i] * (long long)(n - i);
    }

    cout << ans << endl;
    return 0;
}`;

export const codeforcesLanguages = [
  {
    key: "cpp",
    label: "GNU G++17 7.3.0",
    codeforcesLabel: "GNU G++17 7.3.0",
    ext: "cpp",
    defaultFileName: "solution.cpp",
    monacoLanguage: "cpp",
    boilerplate: `#include <bits/stdc++.h>
using namespace std;

void solve() {

}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int t = 1;
    // cin >> t;
    while (t--) {
        solve();
    }

    return 0;
}
`,
  },
  {
    key: "cpp20",
    label: "GNU G++20 13.2 (64 bit, winlibs)",
    codeforcesLabel: "GNU G++20 13.2 (64 bit, winlibs)",
    ext: "cpp",
    defaultFileName: "solution.cpp",
    monacoLanguage: "cpp",
    boilerplate: `#include <bits/stdc++.h>
using namespace std;

void solve() {

}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int t = 1;
    // cin >> t;
    while (t--) {
        solve();
    }

    return 0;
}
`,
  },
  {
    key: "cpp23",
    label: "GNU G++23 14.2 (64 bit, msys2)",
    codeforcesLabel: "GNU G++23 14.2 (64 bit, msys2)",
    ext: "cpp",
    defaultFileName: "solution.cpp",
    monacoLanguage: "cpp",
    boilerplate: `#include <bits/stdc++.h>
using namespace std;

void solve() {

}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int t = 1;
    // cin >> t;
    while (t--) {
        solve();
    }

    return 0;
}
`,
  },
  {
    key: "c",
    label: "GNU GCC C11 5.1.0",
    codeforcesLabel: "GNU GCC C11 5.1.0",
    ext: "c",
    defaultFileName: "solution.c",
    monacoLanguage: "c",
    boilerplate: `#include <stdio.h>

void solve(void) {

}

int main(void) {
    solve();
    return 0;
}
`,
  },
  {
    key: "java",
    label: "Java 21 64bit",
    codeforcesLabel: "Java 21 64bit",
    ext: "java",
    defaultFileName: "Main.java",
    monacoLanguage: "java",
    mainClassName: "Main",
    boilerplate: `import java.io.*;
import java.util.*;

public class Main {
    static final FastScanner fs = new FastScanner(System.in);
    static final PrintWriter out = new PrintWriter(new BufferedWriter(new OutputStreamWriter(System.out)));

    static void solve() throws Exception {

    }

    public static void main(String[] args) throws Exception {
        int t = 1;
        // t = fs.nextInt();
        while (t-- > 0) {
            solve();
        }
        out.flush();
    }

    static class FastScanner {
        private final InputStream in;
        private final byte[] buffer = new byte[1 << 16];
        private int ptr = 0, len = 0;

        FastScanner(InputStream is) {
            in = is;
        }

        private int read() throws IOException {
            if (ptr >= len) {
                len = in.read(buffer);
                ptr = 0;
                if (len <= 0) return -1;
            }
            return buffer[ptr++];
        }

        String next() throws IOException {
            StringBuilder sb = new StringBuilder();
            int c;
            do {
                c = read();
            } while (c <= ' ' && c != -1);
            while (c > ' ') {
                sb.append((char) c);
                c = read();
            }
            return sb.toString();
        }

        int nextInt() throws IOException {
            return Integer.parseInt(next());
        }

        long nextLong() throws IOException {
            return Long.parseLong(next());
        }
    }
}
`,
  },
  {
    key: "python",
    label: "PyPy 3.10 (7.3.15, 64bit)",
    codeforcesLabel: "PyPy 3.10 (7.3.15, 64bit)",
    ext: "py",
    defaultFileName: "solution.py",
    monacoLanguage: "python",
    boilerplate: `import sys


def input():
    return sys.stdin.readline().rstrip()


def solve():
    pass


def main():
    t = 1
    # t = int(input())
    for _ in range(t):
        solve()


if __name__ == "__main__":
    main()
`,
  },
  {
    key: "python313",
    label: "Python 3.13",
    codeforcesLabel: "Python 3.13",
    ext: "py",
    defaultFileName: "solution.py",
    monacoLanguage: "python",
    boilerplate: `import sys


def input():
    return sys.stdin.readline().rstrip()


def solve():
    pass


def main():
    t = 1
    # t = int(input())
    for _ in range(t):
        solve()


if __name__ == "__main__":
    main()
`,
  },
  {
    key: "javascript",
    label: "JavaScript V8 4.8.0",
    codeforcesLabel: "JavaScript V8 4.8.0",
    ext: "js",
    defaultFileName: "solution.js",
    monacoLanguage: "javascript",
    boilerplate: `"use strict";

const fs = require("fs");
const data = fs.readFileSync(0, "utf8").trim();
const input = data.length ? data.split(/\\s+/) : [];
let idx = 0;

function next() {
    return input[idx++];
}

function solve() {

}

function main() {
    let t = 1;
    // t = Number(next());
    while (t--) {
        solve();
    }
}

main();
`,
  },
  {
    key: "nodejs",
    label: "Node.js 15.8.0 (64bit)",
    codeforcesLabel: "Node.js 15.8.0 (64bit)",
    ext: "js",
    defaultFileName: "solution.js",
    monacoLanguage: "javascript",
    boilerplate: `"use strict";

const fs = require("fs");
const data = fs.readFileSync(0, "utf8").trim();
const input = data.length ? data.split(/\\s+/) : [];
let idx = 0;

function next() {
    return input[idx++];
}

function solve() {

}

function main() {
    let t = 1;
    // t = Number(next());
    while (t--) {
        solve();
    }
}

main();
`,
  },
  {
    key: "typescript",
    label: "TypeScript 5.6",
    codeforcesLabel: "TypeScript 5.6",
    ext: "ts",
    defaultFileName: "solution.ts",
    monacoLanguage: "typescript",
    boilerplate: `import * as fs from "fs";

const data = fs.readFileSync(0, "utf8").trim();
const input = data.length ? data.split(/\\s+/) : [];
let idx = 0;

function next(): string {
    return input[idx++];
}

function solve(): void {

}

function main(): void {
    let t = 1;
    // t = Number(next());
    while (t--) {
        solve();
    }
}

main();
`,
  },
  {
    key: "rust",
    label: "Rust 1.89.0 (2021)",
    codeforcesLabel: "Rust 1.89.0 (2021)",
    ext: "rs",
    defaultFileName: "solution.rs",
    monacoLanguage: "rust",
    boilerplate: `use std::io::{self, Read};

fn solve(_tokens: &mut std::str::SplitWhitespace<'_>) {

}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut tokens = input.split_whitespace();

    let t = 1usize;
    // let t: usize = tokens.next().unwrap().parse().unwrap();
    for _ in 0..t {
        solve(&mut tokens);
    }
}
`,
  },
  {
    key: "go",
    label: "Go 1.22.2",
    codeforcesLabel: "Go 1.22.2",
    ext: "go",
    defaultFileName: "solution.go",
    monacoLanguage: "go",
    boilerplate: `package main

import (
    "bufio"
    "fmt"
    "os"
)

var in = bufio.NewReaderSize(os.Stdin, 1<<20)
var out = bufio.NewWriterSize(os.Stdout, 1<<20)

func solve() {

}

func main() {
    defer out.Flush()

    t := 1
    // fmt.Fscan(in, &t)
    for ; t > 0; t-- {
        solve()
    }
}
`,
  },
  {
    key: "kotlin",
    label: "Kotlin 1.9.21",
    codeforcesLabel: "Kotlin 1.9.21",
    ext: "kt",
    defaultFileName: "solution.kt",
    monacoLanguage: "kotlin",
    boilerplate: `import java.io.BufferedInputStream

private class FastScanner {
    private val input = BufferedInputStream(System.in)
    private val buffer = ByteArray(1 shl 16)
    private var len = 0
    private var ptr = 0

    private fun readByte(): Int {
        if (ptr >= len) {
            len = input.read(buffer)
            ptr = 0
            if (len <= 0) return -1
        }
        return buffer[ptr++].toInt()
    }

    fun next(): String {
        val sb = StringBuilder()
        var c = readByte()
        while (c <= 32 && c != -1) c = readByte()
        while (c > 32) {
            sb.append(c.toChar())
            c = readByte()
        }
        return sb.toString()
    }

    fun nextInt(): Int = next().toInt()
    fun nextLong(): Long = next().toLong()
}

private val fs = FastScanner()

fun solve() {

}

fun main() {
    val t = 1
    // val t = fs.nextInt()
    repeat(t) {
        solve()
    }
}
`,
  },
  {
    key: "csharp",
    label: "C# 10, .NET SDK 6.0",
    codeforcesLabel: "C# 10, .NET SDK 6.0",
    ext: "cs",
    defaultFileName: "solution.cs",
    monacoLanguage: "csharp",
    boilerplate: `using System;
using System.IO;
using System.Text;

public class Program
{
    static FastScanner fs = new FastScanner(Console.OpenStandardInput());
    static StringBuilder output = new StringBuilder();

    static void Solve()
    {

    }

    public static void Main()
    {
        int t = 1;
        // t = fs.NextInt();
        while (t-- > 0)
        {
            Solve();
        }
        Console.Write(output.ToString());
    }

    class FastScanner
    {
        private readonly Stream stream;
        private readonly byte[] buffer = new byte[1 << 16];
        private int len, ptr;

        public FastScanner(Stream stream)
        {
            this.stream = stream;
        }

        private int Read()
        {
            if (ptr >= len)
            {
                len = stream.Read(buffer, 0, buffer.Length);
                ptr = 0;
                if (len <= 0) return -1;
            }
            return buffer[ptr++];
        }

        public string Next()
        {
            var sb = new StringBuilder();
            int c;
            do c = Read(); while (c <= 32 && c != -1);
            while (c > 32)
            {
                sb.Append((char)c);
                c = Read();
            }
            return sb.ToString();
        }

        public int NextInt() => int.Parse(Next());
        public long NextLong() => long.Parse(Next());
    }
}
`,
  },
  {
    key: "php",
    label: "PHP 8.1.7",
    codeforcesLabel: "PHP 8.1.7",
    ext: "php",
    defaultFileName: "solution.php",
    monacoLanguage: "php",
    boilerplate: `<?php

$data = trim(stream_get_contents(STDIN));
$tokens = $data === '' ? [] : preg_split('/\\s+/', $data);
$idx = 0;

function nextToken() {
    global $tokens, $idx;
    return $tokens[$idx++] ?? null;
}

function solve() {

}

$t = 1;
// $t = intval(nextToken());
while ($t--) {
    solve();
}
`,
  },
  {
    key: "ruby",
    label: "Ruby 3.2.2",
    codeforcesLabel: "Ruby 3.2.2",
    ext: "rb",
    defaultFileName: "solution.rb",
    monacoLanguage: "ruby",
    boilerplate: `tokens = STDIN.read.split
$idx = 0

def next_token(tokens)
  token = tokens[$idx]
  $idx += 1
  token
end

def solve(tokens)

end

t = 1
# t = next_token(tokens).to_i
t.times do
  solve(tokens)
end
`,
  },
];

export const languageConfigs = Object.fromEntries(
  codeforcesLanguages.map((language) => [language.key, language]),
);

export const defaultPreferredLanguage = "cpp";

export const codeforcesLanguageOptions = codeforcesLanguages.map(
  (language) => ({
    value: language.key,
    label: language.label,
    ext: language.ext,
    defaultFileName: language.defaultFileName,
    codeforcesLabel: language.codeforcesLabel,
  }),
);

export const sampleTestCases = [
  { id: 1, input: "5\n3 1 4 1 5", expected: "38", status: "passed" },
  { id: 2, input: "3\n1 2 3", expected: "10", status: "passed" },
  { id: 3, input: "1\n42", expected: "42", status: "idle" },
];
