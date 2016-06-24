package com.weixin.common;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class MyThead {
	public static void main(String[] args) throws Exception {
//		Thread1 thread1 = new Thread1();
//		Thread thread2 = new Thread(new Thread2(),"second");
//		Thread3 thread3 = new Thread3();
//		System.out.println("主程序.....");
//		thread1.start();
//		thread2.start();
//		System.out.println("主程序挂起4秒");
//		try {
//			Thread.sleep(4*1000);
//		} catch (InterruptedException e) {
//			e.printStackTrace();
//		}
//		if (thread1.isAlive()) {
//			thread1.interrupt();
//		}
//		if (thread2.isAlive()) {
//			thread2.interrupt();
//		}
//		thread1 = new Thread1();
//		thread1.start();
//		thread3.start();
//		System.in.read();
//		thread3.interrupt();
//		thread3.join();
//		System.err.println("线程已退出..");
//		
//		Thread4 thread4 = new Thread4();
//		thread4.start();
//		Thread5 thread5 = new Thread5();
//		thread5.start();
		Thread6 thread6 = new Thread6();
		thread6.start();
		Thread7 thread7 = new Thread7();
		thread7.start();
	}
	
}

class Thread1 extends Thread{
	public Thread1() {
		// TODO Auto-generated constructor stub
	}
	@Override
	public void run() {
		System.out.println("进入线程1");
		System.out.println("线程1休眠3秒");
		try {
			sleep(3*1000);
			System.out.println("线程1后续内容");
		} catch (InterruptedException e) {
			System.err.println("线程1已经被终止...");
		}
	}
}

class Thread2 implements Runnable{
	public Thread2() {
		// TODO Auto-generated constructor stub
	}
	@Override
	public void run() {
		System.out.println("进入线程2");
		System.out.println("线程2休眠5秒");
		try {
			Thread.sleep(5*1000);
			System.out.println("线程2后续内容");
		} catch (InterruptedException e) {
			System.err.println("线程2已经被终止...");
		}
	}
	
}


class Thread3 extends Thread{
	public Thread3() {
		// TODO Auto-generated constructor stub
	}
	@Override
	public void run() {
		try {
			System.out.println("线程3已开始，按下任意键终止");
			int i =1;
			while(true){
				System.out.println(i);
				sleep(1000);
				i++;
			}
		} catch (InterruptedException e) {
			System.err.println("线程3已经被终止...");
		}
	}
}


class Thread4 extends Thread{
	public Thread4() {
		// TODO Auto-generated constructor stub
	}
	@Override
	public void run() {
		System.out.println("进入线程4");
		try {
			int i =1;
			while(i<=7){
				sleep(1000);
				i++;
			}
			System.out.println("线程4执行结束");
		} catch (InterruptedException e) {
			System.err.println("线程4已终止...");
		}
	}
}

class Thread5 extends Thread{
	public Thread5() {
		// TODO Auto-generated constructor stub
	}
	@Override
	public void run() {
		System.out.println("进入线程5");
		try {
			int i =1;
			while(i<=4){
				sleep(1000);
				i++;
			}
			System.out.println("线程5执行结束");
		} catch (InterruptedException e) {
			System.err.println("线程5已终止...");
		}
	}
}

class Thread6 extends Thread{
	public Thread6() {
		// TODO Auto-generated constructor stub
	}
	@Override
	public void run() {
		System.out.println("进入线程6");
		try {
			for (int i = 0; i < 5; i++) {
				final int a = i;
				test.getExecutorService().execute(new Runnable() {
					@Override
					public void run() {
						System.out.println(a);
					}
				});
			}
		} catch (Exception e) {
			System.err.println("线程5已终止...");
		}
	}
}

class Thread7 extends Thread{
	public Thread7() {
		// TODO Auto-generated constructor stub
	}
	@Override
	public void run() {
		System.out.println("进入线程7");
		try {
			for (int i = 0; i < 5; i++) {
				final int a = i;
				test.getExecutorService().execute(new Runnable() {
					@Override
					public void run() {
						System.out.println(a);
					}
				});
			}
		} catch (Exception e) {
			System.err.println("线程5已终止...");
		}
	}
}

class test {
	static final ExecutorService executorService = Executors.newSingleThreadExecutor();

	public static ExecutorService getExecutorService() {
		return executorService;
	}
	
}
