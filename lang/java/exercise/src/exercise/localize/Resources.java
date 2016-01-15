package exercise.localize;

import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLClassLoader;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Locale;
import java.util.ResourceBundle;

public class Resources {

	/**
	 * TTL_DONT_CACHEをgetTimeToLiveに返させることで
	 * メモリ内にリソースバンドルをキャッシュさせないようにする。
	 * デフォルトでは期間無制限でキャッシュされる。
	 */
	private static final ResourceBundle.Control NO_CACHE_CTRL = new ResourceBundle.Control() {
		@Override
		public long getTimeToLive(String baseName, Locale locale) {
			return TTL_DONT_CACHE;
		}
	};

	public static final ResourceBundle getReource(String baseName,
		Path resourcePath, Locale locale) throws MalformedURLException {
		/**
		 * ResourceBundleを得るクラスローダの基点となるパスは，
		 * プロパティファイルがあるディレクトリの絶対パスを指定する。
		 */
		Path classLoaderBasePath = resourcePath.toAbsolutePath().getParent();
		URL[] urls = {classLoaderBasePath.toUri().toURL()};
		ClassLoader classLoader = new URLClassLoader(urls);

		/**
		 * Localeに対応するプロパティファイルが見つからなかった時は
		 * デフォルトロケールのプロパティファイルが参照される。
		 * デフォルトロケールのプロパティファイルも見つからなかった時は
		 * greeting.propertiesのようにロケール指定されていない
		 * プロパティファイルが参照される。それも見つからなかった時は
		 * MissingResourceExceptionがスローされる。
		 * 
		 * 「greeting_en_US.properties」が適切なパスに存在していても
		 * <pre>Locale locale = new Locale("en")</pre>
		 * で生成されたLocaleオブジェクトを使って検索された場合は
		 * 「greeting_en_US.properties」を見つけることができない。
		 * いっぽうで，
		 * <pre>Locale locale = new Locale("en", "US")</pre>
		 * で生成されたLocaleオブジェクトを使った場合は
		 * 「greeting_en.properties」を見つけることができる。
		 * 即ちLocaleの詳細度以下のロケールが指定されたプロパティファイルを
		 * 見つけることができるということである。
		 */
		ResourceBundle resource = ResourceBundle.getBundle(baseName,
			locale, classLoader, NO_CACHE_CTRL);

		return resource;
	}

	public static final ResourceBundle getReource(String baseName, Path path)
		throws MalformedURLException {
		return getReource(baseName, path, Locale.getDefault());
	}

	/**
	 * <p>greeting.propertiesを使った実行例:</p>
	 * <pre>java -classpath exercise.jar exercise.localize.Resources greeting</pre>
	 * <pre>java -classpath exercise.jar exercise.localize.Resources greeting en US</pre>
	 */
	public static void main(String[] args) {
		if (args.length <= 0) {
			String msg = "リソース・バンドルの基底名は必須です。";
			throw new IllegalArgumentException(msg);
		}

		String baseName = args[0];
		Locale locale = Locale.getDefault();
		
		if (args.length == 2) {
			locale = new Locale(args[1]);
		}
		
		if (args.length >= 3) {
			locale = new Locale(args[1], args[2]);
		}

		/**
		 * プロパティファイルはリソースバンドルの基底名と同じでないといけない。
		 * または基底名が「foo.bar.greeting」ならば「foo/bar/greeting.properties」が
		 * 存在していないといけない。
		 * <pre>Paths.get("greeting.properties")</pre>
		 * と指定された場合はプロパティファイルがアプリケーションを
		 * 実行したディレクトリ直下にあると見なされる。
		 */
		Path path = Paths.get(baseName + ".properties");
		try {
			ResourceBundle resource = Resources.getReource(baseName, path, locale);
			resource.keySet().stream()
				.map(key -> resource.getString(key))
				.forEach(System.out::println);
		} catch (MalformedURLException ex) {
			System.err.println("プロパティファイルの読み込みに失敗しました。：" + ex.getMessage());
		}
	}

}
