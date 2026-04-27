import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.WebServlet;

@WebServlet("/FoodServlet")
public class FoodServlet extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        int pizza = 0, burger = 0, pasta = 0;

        try {
            pizza = Integer.parseInt(request.getParameter("pizza"));
        } catch(Exception e) {}

        try {
            burger = Integer.parseInt(request.getParameter("burger"));
        } catch(Exception e) {}

        try {
            pasta = Integer.parseInt(request.getParameter("pasta"));
        } catch(Exception e) {}

        int total = (pizza * 200) + (burger * 100) + (pasta * 150);

        out.println("<html><body>");
        out.println("<h2>Total Bill: ₹" + total + "</h2>");
        out.println("<a href='index.html'>Back</a>");
        out.println("</body></html>");
    }
}