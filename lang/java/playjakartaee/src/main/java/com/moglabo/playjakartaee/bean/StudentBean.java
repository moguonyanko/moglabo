package com.moglabo.playjakartaee.bean;

import java.util.List;
import java.util.ArrayList;
import javax.naming.NamingException;
import jakarta.inject.Named;
import jakarta.enterprise.context.RequestScoped;
import java.sql.SQLException;

@Named
@RequestScoped
public class StudentBean {
    
    private List<Student> students = new ArrayList<>(); 

    public StudentBean() {
        try (var dao = new StudentDao()) {
            students.addAll(dao.getAllStudents());
        } catch (SQLException | NamingException ex) {
            ex.printStackTrace();
        }
    }

    public List<Student> getStudents() {
        return students;
    }

    public void setStudents(List<Student> students) {
        this.students = students;
    }
    
}