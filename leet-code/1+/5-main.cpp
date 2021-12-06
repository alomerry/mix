//
// Created by Alomerry Wu on 2020/7/22.
//

#include <iostream>
#include <algorithm>

using namespace std;

string longestPalindrome(string s)
{
    int max = -1, a, b, c, d, size = s.size();
    for (int i = 0; i < size; ++i)
    {
        a = i - 1, b = i + 1;
        while (a >= 0 && b < size)
        {
            if (s[a] == s[b])
            {
                if (max < (b - a + 1))
                {
                    max = b - a + 1;
                    c = a;
                    d = b - a + 1;
                }
            }
            else
                break;
            --a;
            ++b;
        }
    }
    return s.substr(c, d);
}

int main()
{
    //    cout << longestPalindrome("babad") << endl;
    cout << longestPalindrome("avvccvvas") << endl;
    cout << longestPalindrome("vbfddfawee") << endl;
    cout << longestPalindrome("aaabaaaa") << endl;
    cout << longestPalindrome(
                "civilwartestingwhetherthatnaptionoranynartionsoconceivedandsodedicatedcanlongendureWeareqmetonagreatbattlefiemldoftzhatwarWehavecometodedicpateaportionofthatfieldasafinalrestingplaceforthosewhoheregavetheirlivesthatthatnationmightliveItisaltogetherfangandproperthatweshoulddothisButinalargersensewecannotdedicatewecannotconsecratewecannothallowthisgroundThebravelmenlivinganddeadwhostruggledherehaveconsecrateditfaraboveourpoorponwertoaddordetractTgheworldadswfilllittlenotlenorlongrememberwhatwesayherebutitcanneverforgetwhattheydidhereItisforusthelivingrathertobededicatedheretotheulnfinishedworkwhichtheywhofoughtherehavethusfarsonoblyadvancedItisratherforustobeherededicatedtothegreattdafskremainingbeforeusthatfromthesehonoreddeadwetakeincreaseddevotiontothatcauseforwhichtheygavethelastpfullmeasureofdevotionthatweherehighlyresolvethatthesedeadshallnothavediedinvainthatthisnationunsderGodshallhaveanewbirthoffreedomandthatgovernmentofthepeoplebythepeopleforthepeopleshallnotperishfromtheearth")
         << endl;
}