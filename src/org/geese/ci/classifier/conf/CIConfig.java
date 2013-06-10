package org.geese.ci.classifier.conf;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;
import org.geese.ci.classifier.util.LogUtil;

public class CIConfig{

	private static final String propertiesPath = "org/geese/ci/application.properties";
	private static final Properties properties;

	static{
		properties = new java.util.Properties();

		try{
			InputStream stream = null;
			ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
			if(classLoader != null){
				stream = classLoader.getResourceAsStream(propertiesPath);
			}
			properties.load(stream);
		}catch(FileNotFoundException e){
			LogUtil.error("Properties file is not found. : " + e.getMessage());
		}catch(IOException e){
			LogUtil.error("IO exception occured. : " + e.getMessage());
		}
	}

	public static String getValue(String key){
		if(key != null && !key.isEmpty()){
			return properties.getProperty(key);
		}else{
			throw new IllegalArgumentException("Invalid key recieved. : " + key);
		}
	}
}
