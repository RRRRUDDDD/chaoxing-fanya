import threading
import unittest

import main


class _NoopRateLimiter:
    def limit_rate(self, *args, **kwargs):
        return None


class _DummyChaoxing:
    def __init__(self, job_info):
        self.job_info = job_info
        self.rate_limiter = _NoopRateLimiter()

    def get_job_list(self, course, point):
        return self.job_info["jobs"], self.job_info["job_info"]


class JobProcessorRetryTest(unittest.TestCase):
    def _processor(self, job_info, action="retry", max_tries=3):
        course = {"title": "course"}
        point = {"title": "chapter", "has_finished": False}
        task = main.ChapterTask(index=0, point=point)
        config = {
            "speed": 1.0,
            "jobs": 1,
            "notopen_action": action,
            "retry_interval": 0.01,
        }
        processor = main.JobProcessor(_DummyChaoxing(job_info), course, [task], config)
        processor.max_tries = max_tries
        return processor, task

    def _run(self, processor):
        error = []

        def target():
            try:
                processor.run()
            except BaseException as exc:  # noqa: BLE001
                error.append(exc)

        thread = threading.Thread(target=target, daemon=True)
        thread.start()
        thread.join(5)
        self.assertFalse(thread.is_alive(), "JobProcessor.run() appears to retry forever")
        if error:
            raise error[0]

    def test_not_open_retries_are_bounded(self):
        processor, task = self._processor(
            {"jobs": [], "job_info": {"notOpen": True}}
        )

        self._run(processor)

        self.assertEqual(task.tries, 3)
        self.assertEqual(processor.task_queue.unfinished_tasks, 0)

    def test_continue_skips_without_retry(self):
        processor, task = self._processor(
            {"jobs": [], "job_info": {"notOpen": True}}, action="continue"
        )

        self._run(processor)

        self.assertEqual(task.tries, 0)
        self.assertTrue(processor.retry_queue.empty())


if __name__ == "__main__":
    unittest.main()
