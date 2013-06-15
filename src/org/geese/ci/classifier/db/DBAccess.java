package org.geese.ci.classifier.db;

import java.sql.Connection;
import java.sql.SQLException;

public interface DBAccess {
	Connection connect() throws SQLException;
}
