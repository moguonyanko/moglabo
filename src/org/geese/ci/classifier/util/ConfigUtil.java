package org.geese.ci.classifier.util;

import java.io.IOException;
import java.util.Properties;

import org.geese.ci.classifier.loader.ConfigLoader;

public class ConfigUtil {
	private static final Properties properties = ConfigLoader.load();

	public static String getValue(String key){
		if(key != null && !key.isEmpty()){
			return properties.getProperty(key);
		}else{
			throw new IllegalArgumentException("Invalid key recieved. : " + key);
		}
	}
}
