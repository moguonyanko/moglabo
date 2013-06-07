package org.mognyan.ci.classifier.util;

import org.mognyan.ci.classifier.Classifier;
import org.mognyan.ci.classifier.TrainException;

public class TrainUtil {

	public static void sampleTrain(Classifier cl) throws TrainException {
		cl.train("Nobady owns the water.", "good");
		cl.train("the quick rabbit jumps fences.", "good");
		cl.train("buy pharmaceuticals now", "bad");
		cl.train("make quick money at the online casino", "bad");
		cl.train("the quick brown fox jumps", "good");
	}
}
