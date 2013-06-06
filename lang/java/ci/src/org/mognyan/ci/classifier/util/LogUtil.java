package org.mognyan.ci.classifier.util;

import java.util.logging.Logger;

import org.mognyan.ci.classifier.conf.CIConfig;

public class LogUtil{

	private static final Logger logger;

	static {
		String logName = CIConfig.getValue("log.name");
		logger = Logger.getLogger(logName);
	}
	
	public static void error(String txt){
		logger.severe(txt);
	}
	
	public static void info(String txt){
		logger.info(txt);
	}
	
	public static void warn(String txt){
		logger.warning(txt);
	}
}
