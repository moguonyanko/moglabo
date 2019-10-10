package jp.org.moglabo.pkg.sample;

import java.util.logging.Logger;

/**
 * モジュール練習用クラス
 * 参考:
 * http://java.boot.by/ocpjd11-upgrade-guide/ch01s02.html
 * 
 */
public class SampleLogger {

	private static final Logger LOGGER = 
		Logger.getLogger(SampleLogger.class.getName());

	public static void main(String[] args) {
		System.out.println("SampleLogger main() called");
	}

	public static void logInfo() {
		LOGGER.info("SampleLogger logInfo() called");
	}

	public static Logger getLogger() {
		return LOGGER;
	}

}
	


