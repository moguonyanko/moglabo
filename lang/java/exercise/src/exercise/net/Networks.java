package exercise.net;

import java.net.NetworkInterface;
import java.net.SocketException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.function.Supplier;
import java.util.List;
import java.util.Collections;
import static java.util.stream.Collectors.*;

public class Networks {

	/**
	 * @todo
	 * 再帰するメソッドをラムダ式で表現できないだろうか。
	 */
	private static List<NetworkInterface> getAllInterfaces(List<NetworkInterface> nifs,
		List<NetworkInterface> acc) {
		for (NetworkInterface nif : nifs) {
			if (nif.getSubInterfaces().hasMoreElements()) {
				List<NetworkInterface> subNifs = Collections.list(nif.getSubInterfaces());
				return getAllInterfaces(subNifs, acc);
			} else {
				acc.add(nif);
			}
		}

		return acc;
	}

	public static <C extends Collection<NetworkInterface>> C
		getNetworkInterfaces(Supplier<C> supplier) throws SocketException {
		List<NetworkInterface> nifs = Collections.list(NetworkInterface.getNetworkInterfaces());

		List<NetworkInterface> allNifs = getAllInterfaces(nifs, new ArrayList<>());

		C result = allNifs.stream()
			.collect(toCollection(supplier));

		return result;
	}

}
