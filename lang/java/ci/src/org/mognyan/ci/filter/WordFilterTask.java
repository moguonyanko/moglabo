package org.mognyan.ci.filter;

import java.util.Map;

public interface WordFilterTask {
	Map<String, Integer> get(String doc);
}
