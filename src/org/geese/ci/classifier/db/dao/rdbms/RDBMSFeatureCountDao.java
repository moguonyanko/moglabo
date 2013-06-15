package org.geese.ci.classifier.db.dao.rdbms;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.geese.ci.classifier.Feature;
import org.geese.ci.classifier.db.dao.FeatureCountDao;

public class RDBMSFeatureCountDao extends FeatureCountDao {

	private static final String TABLE = "featurecount";
	private static final String SQL_INSERT = "INSERT INTO " + TABLE + " VALUES (?,?,?);";
	private static final String SQL_SELECT = "SELECT * FROM " + TABLE;
	private static final String SQL_UPDATE = "UPDATE " + TABLE + " SET count=?";
	private static final String SQL_DELETE = "DELETE FROM " + TABLE;
	/* The feature and category is primary key. */
	private static final String SQL_WHERE = " WHERE feature=? AND category=?;";

	public RDBMSFeatureCountDao(Connection connection) {
		super(connection);
	}

	public boolean insert(Feature feature) throws SQLException {
		boolean result = false;
		Connection con = getConnection();

		try (PreparedStatement ps = con.prepareStatement(SQL_INSERT)) {
			ps.setString(1, feature.getWord());
			ps.setString(2, feature.getCategoryName());
			ps.setDouble(3, 1.0);
			result = ps.execute();
		} catch (SQLException sqle) {
			throw sqle;
		}

		return result;
	}

	public double select(Feature feature) throws SQLException {
		double count = 0;
		Connection con = getConnection();

		try (PreparedStatement ps = con.prepareStatement(SQL_SELECT + SQL_WHERE)) {
			ps.setString(1, feature.getWord());
			ps.setString(2, feature.getCategoryName());
			ResultSet rs = ps.executeQuery();
			rs.last();
			int row = rs.getRow();

			if (row > 0) {
				rs.first();
				count = rs.getDouble(3);
			}
		} catch (SQLException sqle) {
			throw sqle;
		}

		return count;
	}

	public int update(double count, Feature feature) throws SQLException {
		int effectCount = 0;
		Connection con = getConnection();

		try (PreparedStatement ps = con.prepareStatement(SQL_UPDATE + SQL_WHERE)) {
			ps.setDouble(1, count);
			ps.setString(2, feature.getWord());
			ps.setString(3, feature.getCategoryName());
			effectCount = ps.executeUpdate();
		} catch (SQLException sqle) {
			throw sqle;
		}

		return effectCount;
	}
}
