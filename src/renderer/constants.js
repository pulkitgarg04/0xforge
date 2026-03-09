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
