'use client';

import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Image, AlertCircle, CheckCircle, ArrowRight, UploadCloud } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/services/api';

export default function PostureEvaluation() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [evaluationResult, setEvaluationResult] = useState<any | null>(null);
  const [step, setStep] = useState<'upload' | 'preview' | 'results'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'video/mp4', 'video/quicktime'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Please upload a valid image (JPEG, PNG) or video (MP4, MOV) file.');
      return;
    }

    // Check file size (max 20MB)
    if (selectedFile.size > 20 * 1024 * 1024) {
      setError('File size exceeds 20MB. Please upload a smaller file.');
      return;
    }

    setFile(selectedFile);
    setError(null);

    // Create preview URL
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
    setStep('preview');

    // Clean up preview URL when component unmounts
    return () => URL.revokeObjectURL(objectUrl);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      
      // Check file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'video/mp4', 'video/quicktime'];
      if (!validTypes.includes(droppedFile.type)) {
        setError('Please upload a valid image (JPEG, PNG) or video (MP4, MOV) file.');
        return;
      }

      // Check file size (max 20MB)
      if (droppedFile.size > 20 * 1024 * 1024) {
        setError('File size exceeds 20MB. Please upload a smaller file.');
        return;
      }

      setFile(droppedFile);
      setError(null);

      // Create preview URL
      const objectUrl = URL.createObjectURL(droppedFile);
      setPreviewUrl(objectUrl);
      setStep('preview');
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const resetUpload = () => {
    setFile(null);
    setPreviewUrl(null);
    setStep('upload');
    setError(null);
    setEvaluationResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadFile = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Make API call to upload the file for ergonomic analysis
      const response = await api.post('/ergonomic/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Set evaluation result data
      setEvaluationResult(response.data.data);
      setStep('results');
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during upload. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Helper function to render file preview
  const renderFilePreview = () => {
    if (!previewUrl) return null;

    if (file?.type.includes('image')) {
      return (
        <img
          src={previewUrl}
          alt="Posture preview"
          className="max-h-96 rounded-lg mx-auto object-contain"
        />
      );
    } else if (file?.type.includes('video')) {
      return (
        <video
          src={previewUrl}
          controls
          className="max-h-96 rounded-lg mx-auto object-contain"
        />
      );
    }

    return null;
  };

  // Render proper ergonomic score status
  const renderScoreStatus = (score: number) => {
    if (score >= 80) {
      return <span className="text-green-600 font-medium">Good</span>;
    } else if (score >= 60) {
      return <span className="text-yellow-600 font-medium">Average</span>;
    } else {
      return <span className="text-red-600 font-medium">Needs Improvement</span>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Posture Evaluation</h1>
          <p className="mt-1 text-sm text-gray-500">
            Upload a photo or video of your working posture for AI-powered ergonomic analysis
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          {/* Step Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className={`h-2 w-full rounded-full ${step === 'upload' ? 'bg-gray-200' : 'bg-cyan-500'}`}></div>
              </div>
              <div className="mx-4">
                <div className={`h-2 w-10 rounded-full ${step === 'results' ? 'bg-cyan-500' : 'bg-gray-200'}`}></div>
              </div>
              <div className="flex-1">
                <div className={`h-2 w-full rounded-full ${step === 'results' ? 'bg-cyan-500' : 'bg-gray-200'}`}></div>
              </div>
            </div>
            <div className="flex justify-between mt-2">
              <span className={`text-xs font-medium ${step === 'upload' ? 'text-cyan-600' : 'text-gray-500'}`}>Upload</span>
              <span className={`text-xs font-medium ${step === 'preview' ? 'text-cyan-600' : 'text-gray-500'}`}>Preview</span>
              <span className={`text-xs font-medium ${step === 'results' ? 'text-cyan-600' : 'text-gray-500'}`}>Results</span>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Step Content */}
          {step === 'upload' && (
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:bg-gray-50 transition-colors duration-200"
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg,image/png,image/jpg,video/mp4,video/quicktime"
                className="hidden"
              />
              <div className="mx-auto h-16 w-16 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-600 mb-4">
                <UploadCloud size={32} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Upload a file</h3>
              <p className="text-sm text-gray-500 mb-4">
                Drag and drop or click to upload a photo or video of your working posture
              </p>
              <p className="text-xs text-gray-400">
                Supports JPG, PNG (images) or MP4, MOV (videos) up to 20MB
              </p>
            </div>
          )}

          {step === 'preview' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Preview</h3>
                <button
                  type="button"
                  onClick={resetUpload}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                {renderFilePreview()}
              </div>
              <div className="text-sm text-gray-500">
                <p>Please ensure that:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Your full body is visible (or at least from head to hips for seated posture)</li>
                  <li>The image/video is clear and well-lit</li>
                  <li>You are in your typical working position</li>
                </ul>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={resetUpload}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={uploadFile}
                  disabled={isUploading}
                  className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isUploading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      Analyze Posture
                      <ArrowRight size={16} className="ml-2" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 'results' && evaluationResult && (
            <div className="space-y-8">
              <div className="text-center">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 mb-4">
                  <CheckCircle size={40} />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Analysis Complete!</h3>
                <p className="text-gray-500">
                  We've analyzed your posture. Here are the results and recommendations.
                </p>
              </div>

              {/* Results Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">RULA Score</h4>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{evaluationResult.totalRula}/10</div>
                  <p className="text-sm text-gray-500">Upper body assessment</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">REBA Score</h4>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{evaluationResult.totalReba}/10</div>
                  <p className="text-sm text-gray-500">Full body assessment</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Overall Status</h4>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {renderScoreStatus(Math.round((evaluationResult.totalRula + evaluationResult.totalReba) / 2 * 10))}
                  </div>
                  <p className="text-sm text-gray-500">Combined assessment</p>
                </div>
              </div>

              {/* Detailed Scores */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Detailed Analysis</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    <div className="bg-white border border-gray-200 p-4 rounded-lg">
                      <h5 className="text-sm font-medium text-gray-500 mb-1">Shoulder/Arm</h5>
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-semibold text-gray-900">{evaluationResult.skorBahuRula}/10</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          evaluationResult.skorBahuRula <= 3 ? 'bg-green-100 text-green-800' :
                          evaluationResult.skorBahuRula <= 7 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {evaluationResult.skorBahuRula <= 3 ? 'Good' :
                           evaluationResult.skorBahuRula <= 7 ? 'Average' : 'Poor'}
                        </span>
                      </div>
                    </div>
                    <div className="bg-white border border-gray-200 p-4 rounded-lg">
                      <h5 className="text-sm font-medium text-gray-500 mb-1">Neck</h5>
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-semibold text-gray-900">{evaluationResult.skorLeherReba}/10</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          evaluationResult.skorLeherReba <= 3 ? 'bg-green-100 text-green-800' :
                          evaluationResult.skorLeherReba <= 7 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {evaluationResult.skorLeherReba <= 3 ? 'Good' :
                           evaluationResult.skorLeherReba <= 7 ? 'Average' : 'Poor'}
                        </span>
                      </div>
                    </div>
                    <div className="bg-white border border-gray-200 p-4 rounded-lg">
                      <h5 className="text-sm font-medium text-gray-500 mb-1">Wrist</h5>
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-semibold text-gray-900">{evaluationResult.skorPergelanganRula}/10</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          evaluationResult.skorPergelanganRula <= 3 ? 'bg-green-100 text-green-800' :
                          evaluationResult.skorPergelanganRula <= 7 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {evaluationResult.skorPergelanganRula <= 3 ? 'Good' :
                           evaluationResult.skorPergelanganRula <= 7 ? 'Average' : 'Poor'}
                        </span>
                      </div>
                    </div>
                    <div className="bg-white border border-gray-200 p-4 rounded-lg">
                      <h5 className="text-sm font-medium text-gray-500 mb-1">Trunk/Back</h5>
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-semibold text-gray-900">{evaluationResult.skorTrunkReba}/10</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          evaluationResult.skorTrunkReba <= 3 ? 'bg-green-100 text-green-800' :
                          evaluationResult.skorTrunkReba <= 7 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {evaluationResult.skorTrunkReba <= 3 ? 'Good' :
                           evaluationResult.skorTrunkReba <= 7 ? 'Average' : 'Poor'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image Result */}
              {evaluationResult.fileUrl && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Posture Analysis</h3>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <img 
                      src={`${process.env.NEXT_PUBLIC_API_URL}/${evaluationResult.fileUrl}`} 
                      alt="Analyzed posture" 
                      className="w-full h-auto max-h-96 object-contain"
                    />
                  </div>
                </div>
              )}

              {/* Recommendations */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recommendations</h3>
                <div className="bg-cyan-50 border border-cyan-100 rounded-lg p-6">
                  <p className="text-gray-700 whitespace-pre-line">{evaluationResult.feedback}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={resetUpload}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50"
                >
                  New Evaluation
                </button>
                <a
                  href="/dashboard/employee/history"
                  className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700 flex items-center"
                >
                  View History
                  <ArrowRight size={16} className="ml-2" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}