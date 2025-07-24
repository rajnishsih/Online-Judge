#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

vector<int> twoSum(const vector<int>& nums, int target) {
    unordered_map<int, int> seen; // number -> index
    for (int i = 0; i < nums.size(); ++i) {
        int complement = target - nums[i];
        if (seen.count(complement)) {
            return {seen[complement], i};
        }
        seen[nums[i]] = i;
    }
    return {}; // Not found (according to problem spec, won't happen)
}

int main() {
    int n; cin>>n;
    
    vector<int> nums(n);
    for(int i=0;i<n;i++) cin>>nums[i];

    int target; cin>>target;
    vector<int> result = twoSum(nums, target);
    if (!result.empty()) {
        cout<< result[0] << " " << result[1] << endl;
    } else {
        cout << "No solution found.\n";
    }
    return 0;
}
