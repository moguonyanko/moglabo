package org.mognyan.ci.db.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.mognyan.ci.util.SQLUtil;

public class CategoryCountDao extends AbstractDao{

	private static final String TABLE = "categorycount";
	private static final String SQL_INSERT = "INSERT INTO " + TABLE + " VALUES (?,?);";
	private static final String SQL_SELECT = "SELECT * FROM " + TABLE;
	private static final String SQL_UPDATE = "UPDATE " + TABLE + " SET count=?";
	private static final String SQL_DELETE = "DELETE FROM " + TABLE;
	/* The category is primary key. */
	private static final String SQL_WHERE = " WHERE category=?;";

	public CategoryCountDao(Connection connection){
		super(connection);
	}

	public boolean insert(String category){
		boolean result = false;
		Connection con = getConnection();

		try(PreparedStatement ps = con.prepareStatement(SQL_INSERT)){
			ps.setString(1, category);
			ps.setDouble(2, 1.0);
			result = ps.execute();
			con.commit();
		}catch(SQLException sqle){
			SQLUtil.rollbackConnection(con);
		}

		return result;
	}

	public double select(String category){
		double count = 0;

		try(Connection con = getConnection();
			PreparedStatement ps = con.prepareStatement(SQL_SELECT + SQL_WHERE)){
			ps.setString(1, category);
			ResultSet rs = ps.executeQuery();
			rs.last();
			int row = rs.getRow();

			if(row > 0){
				rs.first();
				count = rs.getDouble(2);
			}
		}catch(SQLException sqle){
			sqle.printStackTrace();
		}

		return count;
	}

	public Set<String> findAllCategories(){
		Set<String> result = new HashSet<>();
		
		try(Connection con = getConnection();
			PreparedStatement ps = con.prepareStatement(SQL_SELECT + ";")){
			ResultSet rs = ps.executeQuery();
			rs.last();
			int row = rs.getRow();

			if(row > 0){
				rs.first();
				while(rs.next()){
					result.add(rs.getString(1)); /* Hold memory as category type number. */
				}
			}
		}catch(SQLException sqle){
			sqle.printStackTrace();
		}

		return result;
	}
	
	public List<Double> findAllCounts(){
		List<Double> counts = new ArrayList<>();
		
		try(Connection con = getConnection();
			PreparedStatement ps = con.prepareStatement(SQL_SELECT + ";")){
			ResultSet rs = ps.executeQuery();
			rs.last();
			int row = rs.getRow();

			if(row > 0){
				rs.first();
				while(rs.next()){
					counts.add(rs.getDouble(2)); /* Hold memory as category type number. */
				}
			}
		}catch(SQLException sqle){
			sqle.printStackTrace();
		}
		
		return counts;
	}

	public int update(double count, String category){
		int effectCount = 0;
		Connection con = getConnection();

		try(PreparedStatement ps = con.prepareStatement(SQL_UPDATE + SQL_WHERE)){
			ps.setDouble(1, count);
			ps.setString(2, category);
			effectCount = ps.executeUpdate();
			con.commit();
		}catch(SQLException sqle){
			SQLUtil.rollbackConnection(con);
		}

		return effectCount;
	}
}
