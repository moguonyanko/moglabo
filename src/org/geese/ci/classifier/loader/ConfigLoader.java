package org.geese.ci.classifier.loader;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class ConfigLoader {

	private static final String propertiesPath = "org/geese/ci/application.properties";

	public static Properties load() {
		Properties props = new java.util.Properties();

		try {
			InputStream stream = null;
			ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
			if (classLoader != null) {
				stream = classLoader.getResourceAsStream(propertiesPath);
			}
			props.load(stream);
		} catch (IOException e) {
			e.printStackTrace();
		}

		return props;
	}
}
