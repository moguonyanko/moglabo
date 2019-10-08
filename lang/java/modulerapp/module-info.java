/**
 * 参考:
 * http://java.boot.by/ocpjd11-upgrade-guide/ch01.html
 *
 * Command:
 * javac -p . module-info.java app/MyApp.java
 * jar cf app.jar .
 * jdeps --list-deps app.jar
 * jlink --add-modules java.base --output myapp-runtime
 */

module modulerapp {
	// nothing
}
