import unittest
from unittest.mock import patch

import api.decode as decode


class _AttributeResult:
    rec_texts = ("属性结果", "")


class _FakeEngine:
    def predict(self, image):
        self.image = image
        return [{"rec_texts": ["预测结果"]}]


class PaddleOCRIntegrationTest(unittest.TestCase):
    def test_parse_paddleocr_3_mapping_result(self):
        result = [{"rec_texts": ["第一行", "", "第二行"], "rec_scores": [0.9, 0.1, 0.8]}]

        self.assertEqual(decode._parse_paddle_ocr_result(result), ["第一行", "第二行"])

    def test_parse_paddleocr_3_attribute_result(self):
        self.assertEqual(decode._parse_paddle_ocr_result([_AttributeResult()]), ["属性结果"])

    def test_parse_paddleocr_2_nested_result(self):
        result = [[[[0, 0], [10, 10]], ("旧版结果", 0.99)]]

        self.assertEqual(decode._parse_paddle_ocr_result(result), ["旧版结果"])

    def test_init_uses_modern_arguments_and_predict(self):
        calls = []

        class FakePaddleOCR:
            def __init__(self, **kwargs):
                calls.append(kwargs)

            def predict(self, image):
                return _FakeEngine().predict(image)

        old_state = (
            decode._PADDLE_OCR_ENGINE,
            decode._PADDLE_OCR_INITIALIZED,
            decode._PADDLE_OCR_DEVICE,
        )
        try:
            decode._PADDLE_OCR_ENGINE = None
            decode._PADDLE_OCR_INITIALIZED = False
            decode._PADDLE_OCR_DEVICE = None
            with patch.object(decode, "_import_paddle_ocr_class", return_value=FakePaddleOCR):
                engine = decode._init_paddle_ocr(preferred_device="cpu")

            self.assertIsNotNone(engine)
            self.assertEqual(calls[0]["device"], "cpu")
            self.assertIn("text_det_thresh", calls[0])
            self.assertIn("use_textline_orientation", calls[0])
            self.assertEqual(decode._parse_paddle_ocr_result(engine.predict("image")), ["预测结果"])
        finally:
            (
                decode._PADDLE_OCR_ENGINE,
                decode._PADDLE_OCR_INITIALIZED,
                decode._PADDLE_OCR_DEVICE,
            ) = old_state

    def test_init_falls_back_to_paddleocr_2_arguments(self):
        calls = []

        class LegacyPaddleOCR:
            def __init__(self, **kwargs):
                if "text_det_thresh" in kwargs:
                    raise TypeError("unexpected keyword argument")
                calls.append(kwargs)

        old_state = (
            decode._PADDLE_OCR_ENGINE,
            decode._PADDLE_OCR_INITIALIZED,
            decode._PADDLE_OCR_DEVICE,
        )
        try:
            decode._PADDLE_OCR_ENGINE = None
            decode._PADDLE_OCR_INITIALIZED = False
            decode._PADDLE_OCR_DEVICE = None
            with patch.object(decode, "_import_paddle_ocr_class", return_value=LegacyPaddleOCR):
                engine = decode._init_paddle_ocr(preferred_device="cpu")

            self.assertIsNotNone(engine)
            self.assertEqual(calls[0]["use_gpu"], False)
            self.assertIn("det_db_thresh", calls[0])
        finally:
            (
                decode._PADDLE_OCR_ENGINE,
                decode._PADDLE_OCR_INITIALIZED,
                decode._PADDLE_OCR_DEVICE,
            ) = old_state


if __name__ == "__main__":
    unittest.main()
