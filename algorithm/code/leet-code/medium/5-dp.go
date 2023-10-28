package main

//func longestPalindrome(s string) string {
//
//}

//#include <iostream>
//#include <algorithm>
//
//using namespace std;
//bool dp[1000][1000];
//
//string longestPalindrome(string s)
//{
//    int max = -1, a = 0, b = 1, j = 0, size = s.size();
//    for (int l = 0; l < size; ++l)
//    {
//        for (int i = 0; i + l < size; ++i)
//        {
//            j = i + l;
//            if (l == 0)
//                dp[i][j] = true;
//            else if (l == 1)
//                dp[i][j] = s[i] == s[j];
//            else
//                dp[i][j] = s[i] == s[j] && dp[i + 1][j - 1];
//            if (dp[i][j] && max < l + 1)
//            {
//                max = l + 1;
//                a = i;
//                b = l + 1;
//            }
//        }
//    }
//    return s.substr(a, b);
//}
//
//int main()
//{
//    //    cout << longestPalindrome("babad") << endl;
//    //    cout << longestPalindrome("avvccvvas") << endl;
//    //    cout << longestPalindrome("vbfddfawee") << endl;
//    cout << longestPalindrome("aaabaaaa") << endl;
//    cout << longestPalindrome(
//                "civilwartestingwhetherthatnaptionoranynartionsoconceivedandsodedicatedcanlongendureWeareqmetonagreatbattlefiemldoftzhatwarWehavecometodedicpateaportionofthatfieldasafinalrestingplaceforthosewhoheregavetheirlivesthatthatnationmightliveItisaltogetherfangandproperthatweshoulddothisButinalargersensewecannotdedicatewecannotconsecratewecannothallowthisgroundThebravelmenlivinganddeadwhostruggledherehaveconsecrateditfaraboveourpoorponwertoaddordetractTgheworldadswfilllittlenotlenorlongrememberwhatwesayherebutitcanneverforgetwhattheydidhereItisforusthelivingrathertobededicatedheretotheulnfinishedworkwhichtheywhofoughtherehavethusfarsonoblyadvancedItisratherforustobeherededicatedtothegreattdafskremainingbeforeusthatfromthesehonoreddeadwetakeincreaseddevotiontothatcauseforwhichtheygavethelastpfullmeasureofdevotionthatweherehighlyresolvethatthesedeadshallnothavediedinvainthatthisnationunsderGodshallhaveanewbirthoffreedomandthatgovernmentofthepeoplebythepeopleforthepeopleshallnotperishfromtheearth")
//         << endl;
//}
