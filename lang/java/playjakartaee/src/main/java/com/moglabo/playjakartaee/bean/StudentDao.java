package com.moglabo.playjakartaee.bean;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;

public class StudentDao implements AutoCloseable {
    
    private DataSource dataSource;
    
    public StudentDao() throws NamingException {
        dataSource = getDataSource();
    }
    
    private static DataSource getDataSource() throws NamingException {
        var context = new InitialContext();
        return (DataSource) context.lookup("java:comp/env/jdbc/mydb");
    }
    
    public List<Student> getAllStudents() throws SQLException {
        // 本来は結果をまとめてコレクションに保存するのではなく
        // 決まった数だけ返すようにする。そうしないとヒープエラーの
        // 危険が高まってしまう。
        var students = new ArrayList<Student>();
        
        try (var con = dataSource.getConnection()) {
            var sql = "SELECT * FROM students";
            var st = con.createStatement();
            var rs = st.executeQuery(sql);

            while (rs.next()) {
                var name = rs.getString(1);
                var score = rs.getInt(2);
                var student = new Student(name, score);
                students.add(student);
            }
        } 
        
        return students;
    }

    @Override
    public void close() {
        dataSource = null;
    }
}