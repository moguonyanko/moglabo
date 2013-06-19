package org.geese.ci.classifier.probability;

import org.geese.ci.classifier.ClassifyException;

public interface WordProbability{
	double prob(String word, String categoryName) throws ClassifyException;
}
