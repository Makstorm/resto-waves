import { Module } from '@nestjs/common';
import { GoogleController } from './google.controller';
import { GoogleServiceTag, SpreadSheetTag } from '@domain';
import { ConfigService } from '@nestjs/config';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { GoogleService } from './google.service';

const GoogleSpreadsheetProvider = {
  inject: [ConfigService],
  provide: SpreadSheetTag,
  useFactory: async (config: ConfigService) => {
    const serviceAccountAuth = new JWT({
      email: config.getOrThrow('GOOGLE_SERVICE_ACCOUNT_EMAIL'),
      key: config.getOrThrow('GOOGLE_PRIVATE_KEY').replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(
      '1HJzKapn438dVT3vws2Ea7zG9FMmoKv8yE3GbQYvS6GU',
      serviceAccountAuth,
    );

    doc.loadInfo();

    return doc;
  },
};

@Module({
  controllers: [GoogleController],
  providers: [
    GoogleService,
    GoogleSpreadsheetProvider,
    { provide: GoogleServiceTag, useClass: GoogleService },
  ],
})
export class GoogleModule {}
