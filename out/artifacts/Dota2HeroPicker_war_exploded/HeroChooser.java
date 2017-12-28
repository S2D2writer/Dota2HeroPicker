import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created by nealmangaokar on 9/26/17.
 */
@WebServlet(name = "backEnd")
public class HeroChooser extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String chosenHero = request.getParameter("Hero1");
        /*
            Do calculations for best hero
         */
        String bestHero = chosenHero; //placeholder
        request.setAttribute("best_hero", bestHero);

        RequestDispatcher toView = getServletContext().getRequestDispatcher("/goView");
        toView.forward(request,response);
    }

}
