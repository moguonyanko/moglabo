package practicejsf.event;

import javax.faces.application.Application;
import javax.faces.event.PostConstructApplicationEvent;
import javax.faces.event.PreDestroyApplicationEvent;
import javax.faces.event.SystemEvent;
import javax.faces.event.SystemEventListener;

public class ApplicationCustomEventListener implements SystemEventListener {

	@Override
	public void processEvent(SystemEvent event) {
		if (event instanceof PostConstructApplicationEvent) {
			System.out.println("PostConstructApplicationEvent発生！アプリケーションが開始されました。");
		} else if (event instanceof PreDestroyApplicationEvent) {
			System.out.println("PreDestroyApplicationEvent発生！アプリケーションが終了されました。");
		} else {
			System.out.println("イベント発生!" + event.toString());
		}
	}

	@Override
	public boolean isListenerForSource(Object o) {
		return (o instanceof Application);
	}

}
