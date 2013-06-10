package org.mognyan.ci.classifier;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.*;

import org.mognyan.ci.classifier.db.AccessData;
import org.mognyan.ci.classifier.db.dao.CategoryCountDao;
import org.mognyan.ci.classifier.db.dao.FeatureCountDao;
import org.mognyan.ci.classifier.filter.WordFilterTask;
import org.mognyan.ci.classifier.probability.WordProbability;
import org.mognyan.ci.classifier.util.LogUtil;

public abstract class AbstractTransactionClassifier implements TransactionClassifier{

	private final static double WEIGHT = 1.0;
	private final static double AP = 0.5;
	private final WordProbability defaultProbability = new WordProbability(){
		@Override
		public double prob(String word, String categoryName) throws ClassifyException{
			try{
				double catCount = getCategoryCount(categoryName);

				if(catCount > 0){
					return getFeatureCount(word, categoryName) / catCount;
				}else{
					return 0.0;
				}

			}catch(SQLException sqle){
				throw new ClassifyException("Fail to calculate probability.");
			}
		}
	};
	final WordFilterTask task;
	final String defaultClass;
	final Map<String, Double> thresholds = new HashMap<>();
	private Connection con;

	public AbstractTransactionClassifier(WordFilterTask task){
		this(task, "unknown");
	}

	public AbstractTransactionClassifier(WordFilterTask task, String defaultClass){
		this.task = task;
		this.defaultClass = defaultClass;
	}

	/**
	 * Get database connection.
	 *
	 *
	 *
	 * @todo Use DataSource.
	 * @return
	 */
	private Connection getConnection(){
		if(con == null){
			start();
		}

		return con;
	}

	@Override
	public void start(){
		String driverName = "";
		try{
			driverName = AccessData.getDriverName();
			Class.forName(driverName);
			con = DriverManager.getConnection(AccessData.getURL(), AccessData.getUserId(), AccessData.getUserId());
			con.setAutoCommit(false);
		}catch(SQLException ex){
			LogUtil.error("Fail to get connection. : " + ex.getMessage());
		}catch(ClassNotFoundException ex){
			LogUtil.error("Missing driver class. : " + driverName);
		}
	}

	private void incFeatureCount(String word, String categoryName) throws SQLException{
		FeatureCountDao dao = new FeatureCountDao(getConnection());
		
		Feature feature = new Feature(word, categoryName);
		double count = getFeatureCount(word, categoryName);

		if(count <= 0){
			dao.insert(feature);
		}else{
			dao.update(count + 1, feature);
		}
	}

	private void incCategoryCount(String categoryName) throws SQLException{
		CategoryCountDao dao = new CategoryCountDao(getConnection());
		
		Category category = new Category(categoryName);
		double count = getCategoryCount(categoryName);

		if(count <= 0){
			dao.insert(category);
		}else{
			dao.update(count + 1, category);
		}
	}

	double getFeatureCount(String word, String categoryName) throws SQLException{
		FeatureCountDao dao = new FeatureCountDao(getConnection());
		Feature feature = new Feature(word, categoryName);
		double count = dao.select(feature);
		return count;
	}

	double getCategoryCount(String categoryName) throws SQLException{
		CategoryCountDao dao = new CategoryCountDao(getConnection());
		Category category = new Category(categoryName);
		double count = dao.select(category);
		return count;
	}

	double getTotalCategoryCount() throws SQLException{
		CategoryCountDao dao = new CategoryCountDao(getConnection());
		List<Double> counts = dao.findAllCounts();

		double total = 0;

		for(Double count : counts){
			total += Double.valueOf(count);
		}

		return total;
	}

	Set<String> getCategories() throws SQLException{
		CategoryCountDao dao = new CategoryCountDao(getConnection());
		return dao.findAllCategories();
	}

	double featureProb(String word, String categoryName) throws SQLException{
		double catCount = getCategoryCount(categoryName);

		if(catCount > 0){
			return getFeatureCount(word, categoryName) / catCount;
		}else{
			return 0.0;
		}
	}

	double weightProb(String word, String categoryName, WordProbability probability) throws ClassifyException{
		double totalFeatureCount = 0.0;

		try{
			for(String existingCategory : getCategories()){
				totalFeatureCount += getFeatureCount(word, existingCategory);
			}
		}catch(SQLException sqle){
			throw new ClassifyException("Fail to calculate probabillity.");
		}

		double nowProb = probability.prob(word, categoryName);

		double weightedProb = ((WEIGHT * AP) + (totalFeatureCount * nowProb)) / (WEIGHT + totalFeatureCount);

		return weightedProb;
	}

	double weightProb(String word, String categoryName) throws ClassifyException{
		return weightProb(word, categoryName, defaultProbability);
	}

	@Override
	public void train(String doc, String category) throws TrainException{
		Map<String, Integer> result = task.get(doc);

		String word = null;
		try{
			Iterator<String> wordIter = result.keySet().iterator();
			while(wordIter.hasNext()){
				word = wordIter.next();
				incFeatureCount(word, category);
			}

			incCategoryCount(category);
		}catch(SQLException sqle){
			throw new TrainException(word, category, "Fail training.");
		}

	}

	@Override
	public void end(boolean fail){
		try(Connection _con = getConnection()){
			if(!fail){
				_con.commit();
				LogUtil.info("Classfier finished.");
			}else{
				_con.rollback();
				LogUtil.error("Classifier operation failed and rollbacked.");
			}
		}catch(SQLException ex){
			LogUtil.error("Fail to update trainning data and close connection... : " + ex.getMessage());
		}
	}
}
