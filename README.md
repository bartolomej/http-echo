# http-echo

A very simple http echo server, that just returns full http request as text.

Opening [http-echo-node.herokuapp.com](https://http-echo-node.herokuapp.com/) in your browser will return something like this:
```
GET / HTTP/1.1
Server: Cowboy
Date: Thu, 10 Jun 2021 13:11:51 GMT
Connection: close
Host: http-echo-node.herokuapp.com
Sec-Ch-Ua: " Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"
Sec-Ch-Ua-Mobile: ?0
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: cross-site
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Referer: https://dashboard.heroku.com/
Accept-Encoding: gzip, deflate, br
Accept-Language: sl-SI,sl;q=0.9,en-GB;q=0.8,en;q=0.7
X-Request-Id: e82ecebf-da6e-4bc6-86f8-9f2edafa9338
X-Forwarded-For: 89.142.186.247
X-Forwarded-Proto: https
X-Forwarded-Port: 443
Via: 1.1 vegur, 1.1 vegur
Connect-Time: 0
X-Request-Start: 1623330706798
Total-Route-Time: 5004
```
