"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import DropzoneComponent from "@/components/form/form-elements/DropZone";
import { getSubjectById, updateSubject } from "@/services/subjectService";

type FormData = {
  name: string;
  description: string;
  maxTopics: number;
  image: string;
};

const UpdateSubjectPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
const { id: subjectId } = React.use(params);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    maxTopics: 0,
    image: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  // 🔹 Lấy dữ liệu môn học theo ID
  useEffect(() => {
    const fetchSubject = async () => {
      if (!subjectId) return;
      try {
        setIsLoading(true);
        const subjectData = await getSubjectById(subjectId);
        setFormData({
          name: subjectData.name || "",
          description: subjectData.description || "",
          maxTopics: subjectData.maxTopics || 0,
          image: subjectData.image || "",
        });
      } catch (error) {
        console.error("Failed to fetch subject:", error);
        setMessage("❌ Không tìm thấy thông tin môn học.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubject();
  }, [subjectId]);

  // 🔹 Cập nhật dữ liệu form
  const handleChange = useCallback(
    (field: keyof FormData, value: string | number) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [errors]
  );

  // 🔹 Nhận file từ Dropzone
  const handleFileAccepted = (file: File) => {
    setImageFile(file);
    handleChange("image", file.name);
  };

  // 🔹 Validate dữ liệu
  const validateForm = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!formData.name) newErrors.name = "Tên môn học là bắt buộc.";
    if (!formData.description) newErrors.description = "Mô tả là bắt buộc.";
    if (formData.maxTopics <= 0)
      newErrors.maxTopics = "Số chủ đề tối đa phải lớn hơn 0.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔹 Submit cập nhật
  const handleSubmit = async () => {
    if (!validateForm()) {
      setMessage("⚠️ Vui lòng điền đầy đủ thông tin!");
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage("");

      let imageUrl = formData.image;

      // 🔸 Giả lập upload ảnh (nếu có file mới)
      if (imageFile) {
        console.log("Uploading image:", imageFile.name);
        // Giả lập link ảnh mới (trong thực tế sẽ gọi API upload)
        imageUrl = URL.createObjectURL(imageFile);
      }

      const payload = {
        id: subjectId,
        name: formData.name,
        description: formData.description,
        maxTopics: Number(formData.maxTopics),
        image: imageUrl,
      };

      await updateSubject(subjectId, payload);

      setMessage("✅ Cập nhật thành công! Đang chuyển hướng...");
      setTimeout(() => {
        router.push("/subjects");
      }, 2000);
    } catch (error) {
      console.error("Error updating subject:", error);
      setMessage("❌ Cập nhật môn học thất bại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🔹 Hiển thị form
  if (isLoading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Cập nhật môn học" />
        <p className="mt-6 text-center">Đang tải dữ liệu môn học...</p>
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Cập nhật môn học" />
      <div className="max-w-3xl mx-auto mt-6 space-y-6">
        {/* Tên, mô tả, số chủ đề */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Tên môn học</h3>
          <Input
            type="text"
            value={formData.name}
            placeholder="Nhập tên môn học"
            onChange={(e) => handleChange("name", e.target.value)}
            error={!!errors.name}
            hint={errors.name}
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Mô tả</h3>
          <TextArea
            rows={5}
            value={formData.description}
            placeholder="Nhập mô tả môn học"
            onChange={(value) => handleChange("description", value)}
            error={!!errors.description}
            hint={errors.description}
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Số chủ đề tối đa</h3>
          <Input
            type="number"
            min="1"
            value={formData.maxTopics}
            placeholder="Ví dụ: 10"
            onChange={(e) => handleChange("maxTopics", Number(e.target.value))}
            error={!!errors.maxTopics}
            hint={errors.maxTopics}
          />
        </div>

        {/* Ảnh minh họa */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Ảnh minh họa</h3>
          <Input
            type="text"
            value={formData.image}
            placeholder="Dán link ảnh hoặc upload"
            onChange={(e) => handleChange("image", e.target.value)}
          />
          <div className="mt-4">
            <DropzoneComponent onFileAccepted={handleFileAccepted} />
          </div>

          {/* Hiển thị preview ảnh */}
          {formData.image && (
            <div className="mt-4">
              <img
                src={formData.image}
                alt="Preview"
                className="w-48 h-32 object-cover rounded-lg shadow"
              />
            </div>
          )}
        </div>

        {/* Thông báo */}
        {message && (
          <p
            className={`text-sm text-center ${
              message.startsWith("✅")
                ? "text-green-600"
                : message.startsWith("❌")
                ? "text-red-600"
                : "text-yellow-600"
            }`}
          >
            {message}
          </p>
        )}

        {/* Nút cập nhật */}
        <div className="pt-4 text-center">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isSubmitting ? "Đang cập nhật..." : "Cập nhật môn học"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateSubjectPage;
