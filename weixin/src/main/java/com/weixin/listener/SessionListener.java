package com.weixin.listener;

import javax.servlet.http.HttpSessionAttributeListener;
import javax.servlet.http.HttpSessionBindingEvent;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

public class SessionListener implements HttpSessionListener, HttpSessionAttributeListener {

	public void sessionCreated(HttpSessionEvent event) {

	}

	public void sessionDestroyed(HttpSessionEvent event) {

	}

	@Override
	public void attributeAdded(HttpSessionBindingEvent arg0) {

	}

	@Override
	public void attributeRemoved(HttpSessionBindingEvent arg0) {

	}

	@Override
	public void attributeReplaced(HttpSessionBindingEvent arg0) {

	}

}