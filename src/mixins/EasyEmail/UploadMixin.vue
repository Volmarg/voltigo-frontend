<script lang="ts">
import UploadResponse    from "@/scripts/Response/File/Upload/UploadResponse";
import {ComponentData}   from "@/scripts/Vue/Types/Components/types";
import SymfonyRoutes     from "@/router/SymfonyRoutes";
import SymfonyFileRoutes from "@/router/SymfonyRoutes/SymfonyFileRoutes";

export default {
  data(): ComponentData {
    return {
      uploadConfigId: "aca76c769e16ee2f36d755e4bf468188",
      url: {
        upload: SymfonyRoutes.buildUrl(SymfonyFileRoutes.UPLOAD_FILES)
      },
    }
  },
  methods: {
    /**
     * @description handles uploading process on behalf of the EasyEmail (mail template builder)
     */
    async upload(fileName: string, fileSize: number, base64fileContent: string, uploadId: string): Promise<UploadResponse> {
      let data = {
        fileContent     : base64fileContent,
        fileName        : fileName,
        fileSize        : fileSize, // yes, that should be avoided but the uploaded file size is wrong, to small on back, backend has still fallback in case this is manipulated
        userDefinedName : "",
        uploadConfigId  : this.uploadConfigId,
        uploadId        : uploadId,
      };

      this.$rootEvent.showFullPageLoader();

      return await this.$axios.postWithCsrf(this.url.upload, data, false, {}, UploadResponse).then((response: UploadResponse) => {
        this.$rootEvent.hideFullPageLoader();

        if (response.isMessageSet()) {
          this.$rootEvent.showNotification(response.getNotificationType(true), response.message);
        }

        return response;
      });
    }
  }
}
</script>