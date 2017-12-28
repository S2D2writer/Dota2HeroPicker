import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;


/**
 * Created by nealmangaokar on 9/26/17.
 */
@WebServlet(name = "backEnd")
public class HeroChooser extends HttpServlet {

    private static final String heroListLink = "https://api.opendota.com/api/heroes";
    private static final String heroStatsPreLink = "https://api.opendota.com/api/heroes/";
    private static final String heroStatsPostLink = "/matchups";

    /**
     * Defines the GET behavior for a request (AJAX) sent to servlet, either fetches all-hero ID's,
     * or fetches specific hero information from OpenDota API.
     * @param request
     * @param response
     * @throws ServletException
     * @throws IOException
     */
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String url = "";
        /*
            URL setup for OpenDotaFetcher to get desired information.
         */
        String x = request.getParameter("actionCode");
        String ownerHeroTag = "";
        boolean statsRequest = false;
        switch(request.getParameter("actionCode"))
        {
            case "getHeroList":
                url = heroListLink;
                break;
            case "getHeroStats":
                url = heroStatsPreLink + request.getParameter("heroID") + heroStatsPostLink;
                ownerHeroTag = "[{\"hero_id\":" + request.getParameter("heroID") + "},";
                statsRequest = true;
                break;
            default:
                url = heroListLink;
        }
        /*
            Fetch data from OpenDota.
         */
        OpenDotaFetcher fetcher = new OpenDotaFetcher();
        String openDotaData = fetcher.pull(url);
        if (statsRequest)
        {
            openDotaData = openDotaData.substring(1);
            ownerHeroTag += openDotaData;
            openDotaData = ownerHeroTag;
        }
        /*
            Write to response.
         */
        PrintWriter responseWriter = response.getWriter();
        responseWriter.write(openDotaData);
    }

}
