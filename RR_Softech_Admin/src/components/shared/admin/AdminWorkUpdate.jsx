import React, { useState } from "react";
import { UploadCloud, Link as LinkIcon, Loader2 } from "lucide-react";
import { postWorkUpdate } from "../../../api/admin/workUpdate";
import { toast } from "react-toastify";

export default function AdminWorkUpdate({ productId }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link: "",
    attachment: null,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "attachment") {
      setFormData({ ...formData, attachment: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!productId) {
      toast.error("Invalid Product ID");
      setLoading(false);
      return;
    }

    const payload = new FormData();
    payload.append("order", productId);
    payload.append("title", formData.title);
    payload.append("description", formData.description);
    payload.append("link", formData.link || "");

    if (formData.attachment) {
      payload.append("attachment", formData.attachment);
    }

    try {
      
      await postWorkUpdate(payload);
      toast.success("Work Update successfully submitted!");

      setLoading(false);

      // ✔ Reset form
      setFormData({
        title: "",
        description: "",
        link: "",
        attachment: null,
      });

    } catch (err) {
      console.log(err);
      toast.error("Work Update submission failed!");
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-lg border border-gray-200 max-w-6xl mx-auto mt-10">
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">Work Update Submission</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Title */}
        <div>
          <label className="text-gray-700 font-medium">Title</label>
          <input
            type="text"
            name="title"
            placeholder="Enter update title"
            value={formData.title}
            onChange={handleChange}
            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-gray-700 font-medium">Description</label>
          <textarea
            name="description"
            placeholder="Enter work update description..."
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          ></textarea>
        </div>

        {/* Link */}
        <div>
          <label className="text-gray-700 font-medium">Reference Link</label>
          <div className="flex items-center gap-3">
            <LinkIcon className="text-gray-500" size={20} />
            <input
              type="url"
              name="link"
              placeholder="https://example.com"
              value={formData.link}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Attachment */}
        <div>
          <label className="text-gray-700 font-medium">Attachment (PDF, DOCX, etc.)</label>
          <div className="w-full mt-1 p-3 border rounded-lg bg-gray-50 cursor-pointer flex items-center gap-4 hover:bg-gray-100 transition">
            <UploadCloud size={24} className="text-blue-500" />
            <input
              type="file"
              name="attachment"
              accept=".pdf,.doc,.docx,.txt,.pptx"
              onChange={handleChange}
              className="w-full text-sm text-gray-600"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center disabled:bg-blue-400"
        >
          {loading && <Loader2 className="animate-spin mr-2" size={20} />}
          {loading ? "Submitting..." : "Submit Update"}
        </button>
      </form>
    </div>
  );
}
