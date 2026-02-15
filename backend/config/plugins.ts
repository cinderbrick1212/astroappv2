import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
	upload: {
		config: {
			provider: '@strapi-community/strapi-provider-upload-google-cloud-storage',
			providerOptions: {
				bucketName: env('GCS_BUCKET_NAME'),
				basePath: env('GCS_BASE_PATH', ''),
				baseUrl: env('GCS_BASE_URL', undefined),
				publicFiles: env.bool('GCS_PUBLIC_FILES', true),
				uniform: env.bool('GCS_UNIFORM', false),
			},
		},
	},
});

export default config;
