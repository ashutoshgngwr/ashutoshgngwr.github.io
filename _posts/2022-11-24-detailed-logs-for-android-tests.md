---
date: 2022-11-24 04:55:20 +0530
image: false
layout: post
mathjax: false
tags: android tests instrumented-tests espresso gradle bash
title: Displaying detailed results for Android instrumented tests on the terminal
---

I run instrumented tests for [Noice](https://trynoice.com) in a continuous
integration environment. The output of the Gradle tasks that run these tests is
often too trimmed for valuable debugging insights. Moreover, the flakiness of
the instrumented tests on virtual Android devices makes matters even worse. For
example, consider the following output of a test suite run.

```console
> Task :app:connectedFreeDebugAndroidTest
Starting 11 tests on android-30(AVD) - 11

com.github.ashutoshgngwr.noice.fragment.AlarmsFragmentTest > emptyListIndicator[android-30(AVD) - 11] FAILED 
    androidx.test.espresso.base.AssertionErrorHandler$AssertionFailedWithCauseError: 'not (view has effective visibility <VISIBLE> and view.getGlobalVisibleRect() to return non-empty rectangle)' doesn't match the selected view.
    Expected: not (view has effective visibility <VISIBLE> and view.getGlobalVisibleRect() to return non-empty rectangle)
Tests on android-30(AVD) - 11 failed: There was 1 failure(s).

> Task :app:connectedFreeDebugAndroidTest FAILED
```

Notice the missing salient details here, like the line number for the failed
assertion or the name of the test that came before the failed test. It doesn't
happen when running the test suite using Android Studio. I get a detailed
stacktrace there. When I examined the logs that the virtual device generated
during the test suite run, I found that the test runner indeed logs verbose
messages.

```console
E/TestRunner: failed: emptyListIndicator(com.github.ashutoshgngwr.noice.fragment.AlarmsFragmentTest)
E/TestRunner: ----- begin exception -----
E/TestRunner: androidx.test.espresso.base.AssertionErrorHandler$AssertionFailedWithCauseError: 'not (view has effective visibility <VISIBLE> and view.getGlobalVisibleRect() to return non-empty rectangle)' doesn't match the selected view.
E/TestRunner: Expected: not (view has effective visibility <VISIBLE> and view.getGlobalVisibleRect() to return non-empty rectangle)
E/TestRunner:      Got: was <android.widget.LinearLayout{aa40b93 V.E...... ........ 0,198-320,378 #7f0900ee app:id/empty_list_indicator}>
E/TestRunner: View Details: LinearLayout{id=2131296494, res-name=empty_list_indicator, visibility=VISIBLE, width=320, height=180, has-focus=false, has-focusable=false, has-window-focus=true, is-clickable=false, is-enabled=true, is-focused=false, is-focusable=false, is-layout-requested=false, is-selected=false, layout-params=androidx.constraintlayout.widget.ConstraintLayout$LayoutParams@YYYYYY, tag=null, root-is-layout-requested=false, has-input-connection=false, x=0.0, y=198.0, child-count=3}
E/TestRunner: 
E/TestRunner:   at dalvik.system.VMStack.getThreadStackTrace(Native Method)
E/TestRunner:   at java.lang.Thread.getStackTrace(Thread.java:1736)
E/TestRunner:   at androidx.test.espresso.base.AssertionErrorHandler.handleSafely(AssertionErrorHandler.java:3)
E/TestRunner:   at androidx.test.espresso.base.AssertionErrorHandler.handleSafely(AssertionErrorHandler.java:1)
E/TestRunner:   at androidx.test.espresso.base.DefaultFailureHandler$TypedFailureHandler.handle(DefaultFailureHandler.java:4)
E/TestRunner:   at androidx.test.espresso.base.DefaultFailureHandler.handle(DefaultFailureHandler.java:5)
E/TestRunner:   at androidx.test.espresso.ViewInteraction.waitForAndHandleInteractionResults(ViewInteraction.java:5)
E/TestRunner:   at androidx.test.espresso.ViewInteraction.check(ViewInteraction.java:12)
E/TestRunner:   at com.github.ashutoshgngwr.noice.fragment.AlarmsFragmentTest.emptyListIndicator(AlarmsFragmentTest.kt:66)
E/TestRunner:   at java.lang.reflect.Method.invoke(Native Method)
E/TestRunner:   at org.junit.runners.model.FrameworkMethod$1.runReflectiveCall(FrameworkMethod.java:59)
E/TestRunner:   at org.junit.internal.runners.model.ReflectiveCallable.run(ReflectiveCallable.java:12)
E/TestRunner:   at org.junit.runners.model.FrameworkMethod.invokeExplosively(FrameworkMethod.java:56)
E/TestRunner:   at org.junit.internal.runners.statements.InvokeMethod.evaluate(InvokeMethod.java:17)
E/TestRunner:   at androidx.test.internal.runner.junit4.statement.RunBefores.evaluate(RunBefores.java:80)
E/TestRunner:   at dagger.hilt.android.internal.testing.MarkThatRulesRanRule$1.evaluate(MarkThatRulesRanRule.java:108)
E/TestRunner:   at org.junit.runners.ParentRunner$3.evaluate(ParentRunner.java:306)
E/TestRunner:   at org.junit.runners.BlockJUnit4ClassRunner$1.evaluate(BlockJUnit4ClassRunner.java:100)
E/TestRunner:   at org.junit.runners.ParentRunner.runLeaf(ParentRunner.java:366)
E/TestRunner:   at org.junit.runners.BlockJUnit4ClassRunner.runChild(BlockJUnit4ClassRunner.java:103)
E/TestRunner:   at org.junit.runners.BlockJUnit4ClassRunner.runChild(BlockJUnit4ClassRunner.java:63)
E/TestRunner:   at org.junit.runners.ParentRunner$4.run(ParentRunner.java:331)
E/TestRunner:   at org.junit.runners.ParentRunner$1.schedule(ParentRunner.java:79)
E/TestRunner:   at org.junit.runners.ParentRunner.runChildren(ParentRunner.java:329)
E/TestRunner:   at org.junit.runners.ParentRunner.access$100(ParentRunner.java:66)
E/TestRunner:   at org.junit.runners.ParentRunner$2.evaluate(ParentRunner.java:293)
E/TestRunner:   at org.junit.runners.ParentRunner$3.evaluate(ParentRunner.java:306)
E/TestRunner:   at org.junit.runners.ParentRunner.run(ParentRunner.java:413)
E/TestRunner:   at org.junit.runners.Suite.runChild(Suite.java:128)
E/TestRunner:   at org.junit.runners.Suite.runChild(Suite.java:27)
E/TestRunner:   at org.junit.runners.ParentRunner$4.run(ParentRunner.java:331)
E/TestRunner:   at org.junit.runners.ParentRunner$1.schedule(ParentRunner.java:79)
E/TestRunner:   at org.junit.runners.ParentRunner.runChildren(ParentRunner.java:329)
E/TestRunner:   at org.junit.runners.ParentRunner.access$100(ParentRunner.java:66)
E/TestRunner:   at org.junit.runners.ParentRunner$2.evaluate(ParentRunner.java:293)
E/TestRunner:   at org.junit.runners.ParentRunner$3.evaluate(ParentRunner.java:306)
E/TestRunner:   at org.junit.runners.ParentRunner.run(ParentRunner.java:413)
E/TestRunner:   at org.junit.runner.JUnitCore.run(JUnitCore.java:137)
E/TestRunner:   at org.junit.runner.JUnitCore.run(JUnitCore.java:115)
E/TestRunner:   at androidx.test.internal.runner.TestExecutor.execute(TestExecutor.java:67)
E/TestRunner:   at androidx.test.internal.runner.TestExecutor.execute(TestExecutor.java:58)
E/TestRunner:   at androidx.test.runner.AndroidJUnitRunner.onStart(AndroidJUnitRunner.java:446)
E/TestRunner:   at android.app.Instrumentation$InstrumentationThread.run(Instrumentation.java:2205)
E/TestRunner: Caused by: junit.framework.AssertionFailedError: 'not (view has effective visibility <VISIBLE> and view.getGlobalVisibleRect() to return non-empty rectangle)' doesn't match the selected view.
E/TestRunner: Expected: not (view has effective visibility <VISIBLE> and view.getGlobalVisibleRect() to return non-empty rectangle)
E/TestRunner:      Got: was <android.widget.LinearLayout{aa40b93 V.E...... ........ 0,198-320,378 #7f0900ee app:id/empty_list_indicator}>
E/TestRunner: View Details: LinearLayout{id=2131296494, res-name=empty_list_indicator, visibility=VISIBLE, width=320, height=180, has-focus=false, has-focusable=false, has-window-focus=true, is-clickable=false, is-enabled=true, is-focused=false, is-focusable=false, is-layout-requested=false, is-selected=false, layout-params=androidx.constraintlayout.widget.ConstraintLayout$LayoutParams@YYYYYY, tag=null, root-is-layout-requested=false, has-input-connection=false, x=0.0, y=198.0, child-count=3}
E/TestRunner: 
E/TestRunner:   at androidx.test.espresso.matcher.ViewMatchers.assertThat(ViewMatchers.java:16)
E/TestRunner:   at androidx.test.espresso.assertion.ViewAssertions$MatchesViewAssertion.check(ViewAssertions.java:7)
E/TestRunner:   at androidx.test.espresso.ViewInteraction$SingleExecutionViewAssertion.check(ViewInteraction.java:2)
E/TestRunner:   at androidx.test.espresso.ViewInteraction$2.call(ViewInteraction.java:14)
E/TestRunner:   at androidx.test.espresso.ViewInteraction$2.call(ViewInteraction.java:1)
E/TestRunner:   at java.util.concurrent.FutureTask.run(FutureTask.java:266)
E/TestRunner:   at android.os.Handler.handleCallback(Handler.java:938)
E/TestRunner:   at android.os.Handler.dispatchMessage(Handler.java:99)
E/TestRunner:   at android.os.Looper.loop(Looper.java:223)
E/TestRunner:   at android.app.ActivityThread.main(ActivityThread.java:7656)
E/TestRunner:   at java.lang.reflect.Method.invoke(Native Method)
E/TestRunner:   at com.android.internal.os.RuntimeInit$MethodAndArgsCaller.run(RuntimeInit.java:592)
E/TestRunner:   at com.android.internal.os.ZygoteInit.main(ZygoteInit.java:947)
E/TestRunner: ----- end exception -----
W/EmuHWC2 : No layers, exit, buffer 0x0
I/TestRunner: finished: emptyListIndicator(com.github.ashutoshgngwr.noice.fragment.AlarmsFragmentTest)
```

On inspecting the log dump for an entire test suite run, I found the log
messages tagged with the following tags to be most relevant.

1. `AndroidJUnitRunner` for all log levels
1. `TestRunner` for all log levels
1. `MonitoringInstr` for error log level
1. `THREAD_STATE` for error log level

So if I can print log messages with these tags to the console during a test
suite run, I'd have much more debugging information about failures in a CI
environment. To achieve that, I need to spawn a background ADB process to
collect and print the filtered logs. Since I am not savvy enough in Gradle build
scripts, I used a plain old bash script to get the job done. The following is
the stripped version of the [script I'm using in
production](https://github.com/trynoice/android-app/blob/303bb699ff9a4e19dbec9338fba310559ef0e3df/scripts/run-ui-tests.sh).

```bash
#!/usr/bin/env bash

GRADLE_TASK=$1
if [ -z "$GRADLE_TASK" ]; then
  echo "Usage: $0 [ANDROID TEST GRADLE TASK]"
  exit 1
fi

echo "begin streaming test runner logs..."
adb logcat -c # truncate old logs
adb logcat -v raw -v color -s "TestRunner:* AndroidJUnitRunner:* MonitoringInstr:E THREAD_STATE:E" &
LOGCAT_PID=$!

function cleanup() {
  echo "stop streaming test runner logs..."
  kill "$LOGCAT_PID"
}

trap "cleanup" EXIT
echo "starting $GRADLE_TASK gradle task..."
./gradlew --console=plain "$GRADLE_TASK" || exit $?
```

With this script, the output for a test suite run appears on the terminal like
the following. It isn't pretty without colours, so ensure that ADB prints
coloured output.

```console
> Task :app:createFreeDebugAndroidTestApkListingFileRedirect UP-TO-DATE
onCreate Bundle[{testTimeoutSeconds=31536000, coverageFile=/data/data/com.github.ashutoshgngwr.noice/coverage.ec, coverage=true, additionalTestOutputDir=/sdcard/Android/media/com.github.ashutoshgngwr.noice/additional_test_output}]
onStart is called.
Use the raw file system for managing file I/O.
run started: 11 tests
started: vibrateToggle(com.github.ashutoshgngwr.noice.fragment.AlarmsFragmentTest)

> Task :app:connectedFreeDebugAndroidTest
Starting 11 tests on android-30(AVD) - 11

finished: vibrateToggle(com.github.ashutoshgngwr.noice.fragment.AlarmsFragmentTest)
started: enableToggle(com.github.ashutoshgngwr.noice.fragment.AlarmsFragmentTest)
finished: enableToggle(com.github.ashutoshgngwr.noice.fragment.AlarmsFragmentTest)
started: delete(com.github.ashutoshgngwr.noice.fragment.AlarmsFragmentTest)
finished: delete(com.github.ashutoshgngwr.noice.fragment.AlarmsFragmentTest)
started: addAlarm(com.github.ashutoshgngwr.noice.fragment.AlarmsFragmentTest)
finished: addAlarm(com.github.ashutoshgngwr.noice.fragment.AlarmsFragmentTest)
started: updatePreset(com.github.ashutoshgngwr.noice.fragment.AlarmsFragmentTest)
finished: updatePreset(com.github.ashutoshgngwr.noice.fragment.AlarmsFragmentTest)
started: updateLabel(com.github.ashutoshgngwr.noice.fragment.AlarmsFragmentTest)
finished: updateLabel(com.github.ashutoshgngwr.noice.fragment.AlarmsFragmentTest)
started: emptyListIndicator(com.github.ashutoshgngwr.noice.fragment.AlarmsFragmentTest)
failed: emptyListIndicator(com.github.ashutoshgngwr.noice.fragment.AlarmsFragmentTest)
----- begin exception -----
androidx.test.espresso.base.AssertionErrorHandler$AssertionFailedWithCauseError: 'not (view has effective visibility <VISIBLE> and view.getGlobalVisibleRect() to return non-empty rectangle)' doesn't match the selected view.
Expected: not (view has effective visibility <VISIBLE> and view.getGlobalVisibleRect() to return non-empty rectangle)
     Got: was <android.widget.LinearLayout{e7e2e50 V.E...... ........ 0,198-320,378 #7f0900ee app:id/empty_list_indicator}>
View Details: LinearLayout{id=2131296494, res-name=empty_list_indicator, visibility=VISIBLE, width=320, height=180, has-focus=false, has-focusable=false, has-window-focus=true, is-clickable=false, is-enabled=true, is-focused=false, is-focusable=false, is-layout-requested=false, is-selected=false, layout-params=androidx.constraintlayout.widget.ConstraintLayout$LayoutParams@YYYYYY, tag=null, root-is-layout-requested=false, has-input-connection=false, x=0.0, y=198.0, child-count=3}

    at dalvik.system.VMStack.getThreadStackTrace(Native Method)
    at java.lang.Thread.getStackTrace(Thread.java:1736)
    at androidx.test.espresso.base.AssertionErrorHandler.handleSafely(AssertionErrorHandler.java:3)
    at androidx.test.espresso.base.AssertionErrorHandler.handleSafely(AssertionErrorHandler.java:1)
    at androidx.test.espresso.base.DefaultFailureHandler$TypedFailureHandler.handle(DefaultFailureHandler.java:4)
    at androidx.test.espresso.base.DefaultFailureHandler.handle(DefaultFailureHandler.java:5)
    at androidx.test.espresso.ViewInteraction.waitForAndHandleInteractionResults(ViewInteraction.java:5)
    at androidx.test.espresso.ViewInteraction.check(ViewInteraction.java:12)
    at com.github.ashutoshgngwr.noice.fragment.AlarmsFragmentTest.emptyListIndicator(AlarmsFragmentTest.kt:66)
    at java.lang.reflect.Method.invoke(Native Method)
    at org.junit.runners.model.FrameworkMethod$1.runReflectiveCall(FrameworkMethod.java:59)
    at org.junit.internal.runners.model.ReflectiveCallable.run(ReflectiveCallable.java:12)
    at org.junit.runners.model.FrameworkMethod.invokeExplosively(FrameworkMethod.java:56)
    at org.junit.internal.runners.statements.InvokeMethod.evaluate(InvokeMethod.java:17)
    at androidx.test.internal.runner.junit4.statement.RunBefores.evaluate(RunBefores.java:80)
    at dagger.hilt.android.internal.testing.MarkThatRulesRanRule$1.evaluate(MarkThatRulesRanRule.java:108)
    at org.junit.runners.ParentRunner$3.evaluate(ParentRunner.java:306)
    at org.junit.runners.BlockJUnit4ClassRunner$1.evaluate(BlockJUnit4ClassRunner.java:100)
    at org.junit.runners.ParentRunner.runLeaf(ParentRunner.java:366)
    at org.junit.runners.BlockJUnit4ClassRunner.runChild(BlockJUnit4ClassRunner.java:103)
    at org.junit.runners.BlockJUnit4ClassRunner.runChild(BlockJUnit4ClassRunner.java:63)
    at org.junit.runners.ParentRunner$4.run(ParentRunner.java:331)
    at org.junit.runners.ParentRunner$1.schedule(ParentRunner.java:79)
    at org.junit.runners.ParentRunner.runChildren(ParentRunner.java:329)
    at org.junit.runners.ParentRunner.access$100(ParentRunner.java:66)
    at org.junit.runners.ParentRunner$2.evaluate(ParentRunner.java:293)
    at org.junit.runners.ParentRunner$3.evaluate(ParentRunner.java:306)
    at org.junit.runners.ParentRunner.run(ParentRunner.java:413)
    at org.junit.runners.Suite.runChild(Suite.java:128)
    at org.junit.runners.Suite.runChild(Suite.java:27)
    at org.junit.runners.ParentRunner$4.run(ParentRunner.java:331)
    at org.junit.runners.ParentRunner$1.schedule(ParentRunner.java:79)
    at org.junit.runners.ParentRunner.runChildren(ParentRunner.java:329)
    at org.junit.runners.ParentRunner.access$100(ParentRunner.java:66)
    at org.junit.runners.ParentRunner$2.evaluate(ParentRunner.java:293)
    at org.junit.runners.ParentRunner$3.evaluate(ParentRunner.java:306)
    at org.junit.runners.ParentRunner.run(ParentRunner.java:413)
    at org.junit.runner.JUnitCore.run(JUnitCore.java:137)
    at org.junit.runner.JUnitCore.run(JUnitCore.java:115)
    at androidx.test.internal.runner.TestExecutor.execute(TestExecutor.java:67)
    at androidx.test.internal.runner.TestExecutor.execute(TestExecutor.java:58)
    at androidx.test.runner.AndroidJUnitRunner.onStart(AndroidJUnitRunner.java:446)
    at android.app.Instrumentation$InstrumentationThread.run(Instrumentation.java:2205)
Caused by: junit.framework.AssertionFailedError: 'not (view has effective visibility <VISIBLE> and view.getGlobalVisibleRect() to return non-empty rectangle)' doesn't match the selected view.
Expected: not (view has effective visibility <VISIBLE> and view.getGlobalVisibleRect() to return non-empty rectangle)
     Got: was <android.widget.LinearLayout{e7e2e50 V.E...... ........ 0,198-320,378 #7f0900ee app:id/empty_list_indicator}>
View Details: LinearLayout{id=2131296494, res-name=empty_list_indicator, visibility=VISIBLE, width=320, height=180, has-focus=false, has-focusable=false, has-window-focus=true, is-clickable=false, is-enabled=true, is-focused=false, is-focusable=false, is-layout-requested=false, is-selected=false, layout-params=androidx.constraintlayout.widget.ConstraintLayout$LayoutParams@YYYYYY, tag=null, root-is-layout-requested=false, has-input-connection=false, x=0.0, y=198.0, child-count=3}

    at androidx.test.espresso.matcher.ViewMatchers.assertThat(ViewMatchers.java:16)
    at androidx.test.espresso.assertion.ViewAssertions$MatchesViewAssertion.check(ViewAssertions.java:7)
    at androidx.test.espresso.ViewInteraction$SingleExecutionViewAssertion.check(ViewInteraction.java:2)
    at androidx.test.espresso.ViewInteraction$2.call(ViewInteraction.java:14)
    at androidx.test.espresso.ViewInteraction$2.call(ViewInteraction.java:1)
    at java.util.concurrent.FutureTask.run(FutureTask.java:266)
    at android.os.Handler.handleCallback(Handler.java:938)
    at android.os.Handler.dispatchMessage(Handler.java:99)
    at android.os.Looper.loop(Looper.java:223)
    at android.app.ActivityThread.main(ActivityThread.java:7656)
    at java.lang.reflect.Method.invoke(Native Method)
    at com.android.internal.os.RuntimeInit$MethodAndArgsCaller.run(RuntimeInit.java:592)
    at com.android.internal.os.ZygoteInit.main(ZygoteInit.java:947)
----- end exception -----
finished: emptyListIndicator(com.github.ashutoshgngwr.noice.fragment.AlarmsFragmentTest)
started: updateTime(com.github.ashutoshgngwr.noice.fragment.AlarmsFragmentTest)

com.github.ashutoshgngwr.noice.fragment.AlarmsFragmentTest > emptyListIndicator[android-30(AVD) - 11] FAILED 
    androidx.test.espresso.base.AssertionErrorHandler$AssertionFailedWithCauseError: 'not (view has effective visibility <VISIBLE> and view.getGlobalVisibleRect() to return non-empty rectangle)' doesn't match the selected view.
    Expected: not (view has effective visibility <VISIBLE> and view.getGlobalVisibleRect() to return non-empty rectangle)
finished: updateTime(com.github.ashutoshgngwr.noice.fragment.AlarmsFragmentTest)
started: updateWeeklySchedule(com.github.ashutoshgngwr.noice.fragment.AlarmsFragmentTest)
finished: updateWeeklySchedule(com.github.ashutoshgngwr.noice.fragment.AlarmsFragmentTest)
started: list(com.github.ashutoshgngwr.noice.fragment.AlarmsFragmentTest)
finished: list(com.github.ashutoshgngwr.noice.fragment.AlarmsFragmentTest)
started: focusedAlarmIdNavArg(com.github.ashutoshgngwr.noice.fragment.AlarmsFragmentTest)
--------- beginning of crash
finished: focusedAlarmIdNavArg(com.github.ashutoshgngwr.noice.fragment.AlarmsFragmentTest)
run finished: 11 tests, 1 failed, 0 ignored
Tests on android-30(AVD) - 11 failed: There was 1 failure(s).

> Task :app:connectedFreeDebugAndroidTest FAILED
```
