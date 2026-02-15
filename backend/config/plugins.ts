import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => {
	// Only use GCS provider if bucket name is configured
	const gcsBucketName = env('GCS_BUCKET_NAME');
	
	if (gcsBucketName) {
		return {
			upload: {
				config: {
					provider: '@strapi-community/strapi-provider-upload-google-cloud-storage',
					providerOptions: {
						bucketName: gcsBucketName,
						basePath: env('GCS_BASE_PATH', ''),
						baseUrl: env('GCS_BASE_URL', undefined),
						publicFiles: env.bool('GCS_PUBLIC_FILES', true),
						uniform: env.bool('GCS_UNIFORM', false),
					},
				},
			},
		};
	}
	
	// Use default local provider if GCS not configured
	return {};
};

export default config;
