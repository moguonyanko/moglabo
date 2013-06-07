package org.mognyan.ci.classifier;

import java.sql.SQLException;
import java.util.*;

import org.mognyan.ci.classifier.filter.WordFilterTask;
import org.mognyan.ci.classifier.probability.WordProbability;

public class FisherClassifier extends AbstractTransactionClassifier{

	private static final double DEFAULT_MIN_THRES = 0.0;
	private final WordProbability cprob = new WordProbability(){
		@Override
		public double prob(String word, String categoryName) throws ClassifyException{

			try{

				double clf = featureProb(word, categoryName);

				if(clf == 0){
					return 0;
				}else{

					double fpbs = 1.0;

					for(String catName : getCategories()){
						fpbs += featureProb(word, catName);
					}

					return clf / fpbs;
				}

			}catch(SQLException sqle){
				throw new ClassifyException("Misstake calculate prob.");
			}
		}
	};

	public FisherClassifier(WordFilterTask task){
		super(task);
	}

	private double invChi2(double chi, int df){
		double m = chi / 2.0;
		double sum = Math.exp(-m);
		double term = sum;

		int min = 1;
		int max = df / 2;

		for(int i = min; i < max; i++){
			term *= m / i;
			sum += term;
		}

		return Math.min(sum, 1.0);
	}

	@Override
	public double prob(String word, String categoryName) throws ClassifyException{
		Map<String, Integer> result = task.get(word);
		double pb = 1.0;

		for(String wd : result.keySet()){
			pb *= weightProb(word, categoryName, cprob);
		}

		double fScore = -2 * Math.log(pb);

		return invChi2(fScore, result.size() * 2);
	}

	@Override
	public void setThresholds(String categoryName, double minimum){
		thresholds.put(categoryName, minimum);
	}

	@Override
	public double getThresholds(String categoryName){
		if(!thresholds.containsKey(categoryName)){
			return DEFAULT_MIN_THRES;
		}else{
			return thresholds.get(categoryName);
		}
	}

	@Override
	public String classify(String word) throws ClassifyException{
		String best = defaultClass;
		double max = 0.0;

		try{
			for(String category : getCategories()){
				double pb = prob(word, category);

				if(getThresholds(category) < pb && max < pb){
					best = category;
					max = pb;
				}
			}
		}catch(SQLException sqle){
			throw new ClassifyException("Misstake classify.");
		}

		return best;
	}
}
