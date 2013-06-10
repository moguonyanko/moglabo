package org.geese.ci.classifier.filter;

import java.util.Map;

public interface WordFilterTask {
	Map<String, Integer> get(String doc);
}
