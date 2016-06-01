package practicejsf.util;

import java.io.Closeable;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Map;

import javax.faces.context.FacesContext;

public final class Faces {

	public static <T> T getData(String key, Class<T> klass) {
		FacesContext context = FacesContext.getCurrentInstance();
		Map<String, Object> sessionMap = context.getExternalContext().getSessionMap();
		Object o = sessionMap.get(key);

		if (klass.isInstance(o)) {
			return klass.cast(o);
		} else {
			return null;
		}
	}

	public static boolean close(Closeable closeable) {
		if (closeable != null) {
			try {
				closeable.close();
			} catch (Exception exception) {
				System.err.println("クローズ失敗:" + exception.getMessage());
				return false;
			}
		}

		return true;
	}

	public static boolean close(final Connection connection) {
		boolean closed = Faces.close(new Closeable() {
			@Override
			public void close() throws IOException {
				try {
					if(connection != null){
						connection.close();
					}
				} catch (SQLException ex) {
					throw new IOException(ex);
				}
			}
		});

		return closed;
	}

}
