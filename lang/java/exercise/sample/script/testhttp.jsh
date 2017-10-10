/env --add-modules jdk.incubator.httpclient;

import jdk.incubator.http.HttpClient;

HttpClient client = HttpClient.newHttpClient();
client.version();
