package exercise.database;

import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.sql.rowset.CachedRowSet;
import javax.sql.rowset.JoinRowSet;
import javax.sql.rowset.RowSetFactory;
import javax.sql.rowset.RowSetProvider;

public class JoinRowSetPractice {

	public static void main(String[] args) {

		try {
			String url = "jdbc:mysql://localhost:3306/geolib";
			String user = "geofw", pass = "geofw";

			RowSetFactory factory = RowSetProvider.newFactory();
			final String matchColumnName = "featureid";
			final String matchValue = "1";

			try (CachedRowSet attrSet = factory.createCachedRowSet();
				CachedRowSet primSet = factory.createCachedRowSet();
				JoinRowSet featureSet = factory.createJoinRowSet();) {

				int joinType;

				joinType = JoinRowSet.INNER_JOIN; /* Default */
				
				 /* unsupported? thrown SQLException at MySQL5.5(GNU/Linux)  */
				//joinType = JoinRowSet.FULL_JOIN;
				//joinType = JoinRowSet.LEFT_OUTER_JOIN;
				//joinType = JoinRowSet.RIGHT_OUTER_JOIN;
				//joinType = JoinRowSet.CROSS_JOIN;

				featureSet.setJoinType(joinType);

				String attrSQL = getSelectSelect("mapattribute", matchColumnName, matchValue);
				attrSet.setCommand(attrSQL);
				attrSet.setUsername(user);
				attrSet.setPassword(pass);
				attrSet.setUrl(url);
				attrSet.execute();
				attrSet.setMatchColumn(matchColumnName);
				featureSet.addRowSet(attrSet);

				String primSQL = getSelectSelect("mapprimitive", matchColumnName, matchValue);
				primSet.setCommand(primSQL);
				primSet.setUsername(user);
				primSet.setPassword(pass);
				primSet.setUrl(url);
				primSet.execute();
				primSet.setMatchColumn(matchColumnName);
				featureSet.addRowSet(primSet);

				while (featureSet.next()) {
					System.out.println(featureSet.getString("attribute"));
					System.out.println(featureSet.getString("coords"));
				}

			} catch (SQLException ex) {
				Logger.getLogger(JoinRowSetPractice.class.getName()).log(Level.SEVERE, null, ex);
			}
		} catch (SQLException ex) {
			Logger.getLogger(JoinRowSetPractice.class.getName()).log(Level.SEVERE, null, ex);
		}
	}

	private static String getSelectSelect(String table, String whereKey, String whereValue) {
		final String selectSQL = "SELECT * FROM " + table + " ";
		final String whereSQL = "WHERE " + whereKey + " = " + whereValue;

		return selectSQL + whereSQL;
	}
}
