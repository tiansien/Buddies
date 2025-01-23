import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

interface BlogUpdateData {
  blogDto: any;
  files?: File[];
  existingImages?: string[];
}

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private apiUrl = 'http://localhost:8080/api/blogs';

  constructor(private http: HttpClient) {}

  getAllBlog(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  getBlogById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/allblogstesting${id}`);
  }

  getBlogWithProfile(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  getAllBlogsTest(userId?: string): Observable<any> {
    let params = new HttpParams();
    if (userId !== undefined && userId !== null) {
      params = params.set('userId', userId.toString());
    }
    return this.http.get(`${this.apiUrl}/allblogstesting`, { params });
  }

  createBlog(blogDto: any, files: File[]): Observable<any> {
    const formData = new FormData();

    // Append blogDto as a JSON blob
    formData.append(
      'blogDto',
      new Blob([JSON.stringify(blogDto)], { type: 'application/json' })
    );

    // Append each file to the FormData
    files.forEach((file, index) => {
      formData.append('files', file, file.name);
    });

    return this.http.post(`${this.apiUrl}/createblog`, formData);
  }

  getAllBlogWithProfileUser(userId?: string): Observable<any> {
    let params = new HttpParams();
    if (userId !== undefined && userId !== null) {
      params = params.set('userId', userId.toString());
    }
    return this.http.get(`${this.apiUrl}/allblogswithprofileuser`, { params });
  }

  getAllBlogsWithProfilesFollowed(userId: string): Observable<any> {
    let params = new HttpParams();
    if (userId !== undefined && userId !== null) {
      params = params.set('userId', userId.toString());
    }
    return this.http.get(`${this.apiUrl}/getAllBlogsWithProfilesFollowed`, {
      params,
    });
  }

  updateBlog(updateData: BlogUpdateData): Observable<any> {
    const formData = new FormData();

    // Append blogDto as JSON with explicit content type
    const blogDtoBlob = new Blob([JSON.stringify(updateData.blogDto)], {
      type: 'application/json',
    });
    formData.append('blogDto', blogDtoBlob);

    // Append new files if they exist
    if (updateData.files && updateData.files.length > 0) {
      updateData.files.forEach((file) => {
        formData.append('files', file);
      });
    }

    // Append existing images array as a single JSON string
    if (updateData.existingImages && updateData.existingImages.length > 0) {
      const existingImagesBlob = new Blob(
        [JSON.stringify(updateData.existingImages)],
        {
          type: 'application/json',
        }
      );
      formData.append('existingImages', existingImagesBlob);
    }

    return this.http.put<any>(`${this.apiUrl}/update`, formData);
  }

  deleteBlog(blogId: string) {
    return this.http.delete(`${this.apiUrl}/${blogId}`);
  }
}
