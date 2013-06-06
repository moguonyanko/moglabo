package org.mognyan.ci.classifier.probability;

import org.mognyan.ci.classifier.ClassifierException;

public interface WordProbability{
	double prob(String word, String categoryName) throws ClassifierException;
}
