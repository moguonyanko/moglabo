package exercise.database;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.sql.RowSet;
import javax.sql.rowset.FilteredRowSet;
import javax.sql.rowset.Predicate;
import javax.sql.rowset.RowSetProvider;

public class FilteredRowSetPractice {

	public static void main(String[] args) {

		String url = "jdbc:mysql://localhost:3306/geolib";
		String user = "geofw", pass = "geofw";

		String targetColumnValue = "water";

		try (FilteredRowSet rowSet = RowSetProvider.newFactory().createFilteredRowSet();) {

			rowSet.setCommand("SELECT * FROM featurecount;");
			rowSet.setUsername(user);
			rowSet.setPassword(pass);
			rowSet.setUrl(url);

			Predicate predicate = FeatureNameFilterFactory.createFilter(targetColumnValue);

			rowSet.setFilter(predicate);

			rowSet.execute();
			
			ResultSet rs = rowSet.getOriginal();
			//rowSet.beforeFirst();
			//ResultSet rs = rowSet.getOriginalRow();
			//rs.beforeFirst();
			
			rowSet.populate(rs);

			while (rowSet.next()) {
				System.out.println(rowSet.getString("feature"));
			}

		} catch (SQLException ex) {
			Logger.getLogger(FilteredRowSetPractice.class.getName()).log(Level.SEVERE, null, ex);
		}
	}
}

class FeatureNameFilterFactory {

	static Predicate createFilter(String targetColumnValue) {

		String targetColumnName = "feature";
		int targetColumnNum = 1;
		Predicate predicate = new FeatureNameFilter(targetColumnName,
			targetColumnNum, targetColumnValue);

		return predicate;

	}
}

class FeatureNameFilter implements Predicate {

	private final String colName;
	private final int colNum;
	private final String targetFeature;

	public FeatureNameFilter(String colName, int colNum, String targetFeature) {
		this.colName = colName;
		this.colNum = colNum;
		this.targetFeature = targetFeature;
	}

	@Override
	public boolean evaluate(RowSet rs) {

		String name;
		try {
			name = rs.getString(this.colName);
		} catch (SQLException ex) {
			return false;
		}

		return this.targetFeature.equalsIgnoreCase(name);

	}

	@Override
	public boolean evaluate(Object value, int column) throws SQLException {

		if (this.colNum == column) {
			String name = (String) value;
			return this.targetFeature.equalsIgnoreCase(name);
		} else {
			return false;
		}

	}

	@Override
	public boolean evaluate(Object value, String columnName) throws SQLException {

		if (this.colName.equals(columnName)) {
			String name = (String) value;
			return this.targetFeature.equalsIgnoreCase(name);
		} else {
			return false;
		}

	}
}
