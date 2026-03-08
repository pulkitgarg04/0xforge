export const icons = {
    files: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6',
    search: 'M11 3a8 8 0 1 0 0 16 8 8 0 0 0 0-16z M21 21l-4.35-4.35',
    play: 'M5 3l14 9-14 9V3z',
    terminal: 'M4 17l6-5-6-5 M12 19h8',
    settings: 'M12 1a3 3 0 0 0-3 3v1a7.07 7.07 0 0 0-3.36 1.94L4.5 6.27A3 3 0 1 0 1.27 9.5l.67 1.14A7.07 7.07 0 0 0 1 14v1a3 3 0 0 0 6 0v-1a7.07 7.07 0 0 0 .96-3.36l1.14.67A3 3 0 1 0 12.34 8.1l-.67-1.14A7.07 7.07 0 0 0 15 4V3a3 3 0 0 0-3-3z',
    chevronR: 'M9 18l6-6-6-6',
    flask: 'M9 3h6 M12 3v7.5 M5.5 21h13a1 1 0 0 0 .87-1.5l-5.87-10h-2l-5.87 10A1 1 0 0 0 5.5 21z',
    cpu: 'M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z M9 1v3 M15 1v3 M9 20v3 M15 20v3 M1 9h3 M1 15h3 M20 9h3 M20 15h3',
    circle: 'M12 12m-10 0a10 10 0 1 0 20 0a10 10 0 1 0-20 0',
};

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

export const sampleTestCases = [
    { id: 1, input: '5\n3 1 4 1 5', expected: '38', status: 'passed' },
    { id: 2, input: '3\n1 2 3', expected: '10', status: 'passed' },
    { id: 3, input: '1\n42', expected: '42', status: 'idle' },
];
