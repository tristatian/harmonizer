import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import spark.ModelAndView;
import spark.template.freemarker.FreeMarkerEngine;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.PreparedStatement;
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

    get("/melodies", (request, response) -> {
      try (Connection conn = dataSource.getConnection()) {
        Statement stmt = conn.createStatement();
        stmt.executeUpdate("CREATE TABLE IF NOT EXISTS melodies (name varchar, content varchar)");
        ResultSet rs = stmt.executeQuery("SELECT name FROM melodies");
        StringBuilder builder = new StringBuilder();
        while (rs.next()) {
          builder.append(rs.getString("name"));
          builder.append("\n");
        }
        return builder.toString();
      } catch (Exception e) {
        response.status(500);
        return "Error";
      }
    });

    post("/load", (request, response) -> {
      try (Connection conn = dataSource.getConnection()) {
        conn.createStatement().executeUpdate("CREATE TABLE IF NOT EXISTS melodies (name varchar, content varchar)");
        PreparedStatement ps = conn.prepareStatement("SELECT content FROM melodies WHERE name = ?");
        ps.setString(1, request.body().trim());
        ResultSet rs = ps.executeQuery();
        if (rs.next()) {
          return rs.getString("content");
        }
        response.status(404);
        return "Melody not found";
      } catch (Exception e) {
        response.status(500);
        return "Error";
      }
    });

    post("/save", (request, response) -> {
      try (Connection conn = dataSource.getConnection()) {
        conn.createStatement().executeUpdate("CREATE TABLE IF NOT EXISTS melodies (name varchar, content varchar)");
        String body = request.body();
        String[] lines = body.split("\n");
        PreparedStatement ps = conn.prepareStatement("INSERT INTO melodies VALUES (?, ?)");
        ps.setString(1, lines[0].trim());
        ps.setString(2, lines[1].trim());
        ps.executeUpdate();
        return "Success";
      } catch (Exception e) {
        response.status(404);
        return "Error";
      }
    });

    post("/delete", (request, response) -> {
      try (Connection conn = dataSource.getConnection()) {
        conn.createStatement().executeUpdate("CREATE TABLE IF NOT EXISTS melodies (name varchar, content varchar)");
        PreparedStatement ps = conn.prepareStatement("DELETE FROM melodies WHERE name = ?");
        ps.setString(1, request.body().trim());
        ps.executeUpdate();
        return "Success";
      } catch (Exception e) {
        response.status(404);
        return "Error";
      }
    });
  }
}
