package org.geese.ci.classifier.util;

import org.geese.ci.classifier.Classifier;
import org.geese.ci.classifier.TrainException;

public class TrainUtil {

	public static void train(Classifier cl) throws TrainException {
		cl.train("Nobady owns the water.", "good");
		cl.train("the quick rabbit jumps fences.", "good");
		cl.train("buy pharmaceuticals now", "bad");
		cl.train("make quick money at the online casino", "bad");
		cl.train("the quick brown fox jumps", "good");
	}
}
