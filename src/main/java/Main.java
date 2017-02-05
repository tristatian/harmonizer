import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import spark.ModelAndView;
import spark.template.freemarker.FreeMarkerEngine;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import static spark.Spark.*;

public class Main {

  public static void main(String[] args) {

    port(Integer.valueOf(System.getenv("PORT")));
    staticFileLocation("/public");

    get("/", (request, response) -> {
        response.redirect("index.html");
        return null;
    });

    HikariConfig config = new  HikariConfig();
    config.setJdbcUrl(System.getenv("JDBC_DATABASE_URL"));
    final HikariDataSource dataSource = (config.getJdbcUrl() != null) ?
      new HikariDataSource(config) : new HikariDataSource();

    get("/load", (request, response) -> {
      try(Connection connection = dataSource.getConnection()) {
        Statement stmt = connection.createStatement();
        stmt.executeUpdate("CREATE TABLE IF NOT EXISTS melodies (name varchar, content varchar)");
        ResultSet rs = stmt.executeQuery("SELECT * FROM melodies");

        ArrayList<String> output = new ArrayList<String>();
        String str = "";
        while (rs.next()) {
          str += rs.getString("name");
        }
        return str;
      } catch (Exception e) {
        return "Error";
      }
    });

    post("/save", (request, response) -> {
      try(Connection connection = dataSource.getConnection()) {
        Statement stmt = connection.createStatement();
        stmt.executeUpdate("CREATE TABLE IF NOT EXISTS melodies (name varchar, content varchar)");
        // stmt.executeUpdate("INSERT INTO melodies VALUES (" + + ")");
        System.out.println("Request: " + request.body());
        return "Success";
      } catch (Exception e) {
        return "Error";
      }
    });
  }
}
