package org.mognyan.ci.classifier.probability;

import org.mognyan.ci.classifier.ClassifyException;

public interface WordProbability{
	double prob(String word, String categoryName) throws ClassifyException;
}
