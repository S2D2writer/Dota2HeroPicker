/**
 * Created by nealmangaokar on 10/16/17.
 */

import org.apache.commons.io.IOUtils;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Scanner;


public class OpenDotaFetcher
{
    /**
     * Pulls all-hero information/hero-specific stats from the OpenDota web service (credit to apache hc libraries)
     * @return String of hero stats
     * @throws IOException
     */
    public String pull(String url) throws IOException, IllegalArgumentException {

        CloseableHttpClient winPullClient = HttpClients.createDefault();
        HttpGet winGet = new HttpGet(url);
        CloseableHttpResponse winRateResponse = winPullClient.execute(winGet);
        HttpEntity winRates;
        InputStream stream;
        try {
            winRates = winRateResponse.getEntity();
            stream = winRates.getContent();
            Scanner s = new Scanner(stream).useDelimiter("\\A");
            String result = s.hasNext() ? s.next() : "";
            return result;
        }
        finally {
            winRateResponse.close();
        }

    }
}

